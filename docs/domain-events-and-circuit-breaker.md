# Domain Events e Circuit Breaker

Este documento descreve a implementação de Domain Events e Circuit Breaker para filas BullMQ.

## Domain Events

O sistema de Domain Events permite que entidades de domínio disparem eventos que podem ser escutados por outros serviços, como o `AuditInterceptor` ou notificações por email.

### Estrutura

```
shared/
├── domain/
│   ├── events/
│   │   └── domain-event.base.ts      # Classe base para todos os eventos
│   └── entities/
│       └── aggregate-root.entity.ts  # Classe base para entidades com eventos
└── infrastructure/
    ├── services/
    │   └── domain-event-publisher.service.ts  # Publicador de eventos
    └── handlers/
        └── domain-event-audit.handler.ts      # Handler que escuta eventos e envia para auditoria
```

### Eventos Disponíveis

#### Usuários

- `usuario.created` - Usuário criado
- `usuario.updated` - Usuário atualizado
- `usuario.soft_deleted` - Usuário removido (soft delete)
- `usuario.restored` - Usuário restaurado
- `usuario.password_changed` - Senha alterada
- `usuario.added_to_empresa` - Usuário adicionado a empresa
- `usuario.removed_from_empresa` - Usuário removido da empresa

#### Empresas

- `empresa.created` - Empresa criada
- `empresa.updated` - Empresa atualizada
- `empresa.activated` - Empresa ativada
- `empresa.deactivated` - Empresa desativada
- `empresa.soft_deleted` - Empresa removida (soft delete)
- `empresa.restored` - Empresa restaurada

### Como Usar

#### 1. Criando um Novo Evento

```typescript
import { DomainEvent } from '../../../shared/domain/events/domain-event.base';

export class MeuEventoCustomizado extends DomainEvent {
  constructor(
    public readonly meuId: number,
    public readonly dados: any,
  ) {
    super();
  }

  getEventName(): string {
    return 'meu_dominio.evento_customizado';
  }
}
```

#### 2. Disparando Eventos no Repository

```typescript
import { DomainEventPublisher } from '../../../shared/infrastructure/services/domain-event-publisher.service';
import { UsuarioCreatedEvent } from '../../domain/events/usuario.events';

@Injectable()
export class MeuRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async create(data: any): Promise<Entidade> {
    // ... lógica de criação

    // Dispara evento
    await this.eventPublisher.publish(new UsuarioCreatedEvent(entidade.id, entidade.email));

    return entidade;
  }
}
```

#### 3. Criando um Handler para Escutar Eventos

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MeuEventoCustomizado } from './meu-evento.events';

@Injectable()
export class MeuEventoHandler {
  private readonly logger = new Logger(MeuEventoHandler.name);

  @OnEvent('meu_dominio.evento_customizado')
  async handleMeuEvento(event: MeuEventoCustomizado) {
    this.logger.debug(`Evento recebido: ${event.meuId}`);
    // ... lógica de processamento
  }
}
```

#### 4. Registrando o Handler no Módulo

```typescript
@Module({
  providers: [
    // ... outros providers
    MeuEventoHandler,
  ],
})
export class MeuModule {}
```

## Circuit Breaker para BullMQ

O `ResilientQueueService` adiciona uma camada de Circuit Breaker em cima das filas BullMQ, aumentando a resiliência do sistema.

### Estrutura

```
shared/
└── infrastructure/
    └── services/
        └── resilient-queue.service.ts  # Serviço com Circuit Breaker
```

### Funcionalidades

- **Circuit Breaker individual por fila**: Cada fila tem seu próprio Circuit Breaker
- **Fallback automático**: Quando o Circuit Breaker está aberto, as operações falham rápido
- **Auto-recuperação**: O Circuit Breaker tenta se recuperar automaticamente
- **Métricas**: Status dos Circuit Breakers pode ser consultado

### Configuração Padrão

- **Timeout**: 10 segundos
- **Error Threshold**: 50% de falhas
- **Reset Timeout**: 30 segundos

### Como Usar

#### 1. Injeção do Serviço

```typescript
@Injectable()
export class MeuProducerService {
  constructor(
    @InjectQueue('minha_fila') private readonly minhaFila: Queue,
    private readonly resilientQueueService: ResilientQueueService,
  ) {}
}
```

#### 2. Adicionando Jobs

```typescript
async adicionarJob(dados: any) {
  await this.resilientQueueService.addToQueue(
    this.minhaFila,
    'nome_do_job',
    dados,
    {
      timeout: 10000,
      errorThresholdPercentage: 50,
      resetTimeout: 30000,
    },
  );
}
```

#### 3. Adicionando Jobs com Prioridade

```typescript
async adicionarJobPrioritario(dados: any) {
  await this.resilientQueueService.addToQueueWithPriority(
    this.minhaFila,
    'nome_do_job',
    dados,
    1, // Prioridade (menor = mais prioritário)
    {
      timeout: 5000,
      errorThresholdPercentage: 30,
      resetTimeout: 60000,
    },
  );
}
```

#### 4. Adicionando Jobs em Bulk

```typescript
async adicionarJobsEmBulk(dadosArray: any[]) {
  const jobs = dadosArray.map((dados) => ({
    name: 'nome_do_job',
    data: dados,
  }));

  await this.resilientQueueService.addBulkToQueue(
    this.minhaFila,
    jobs,
  );
}
```

#### 5. Consultando Status

```typescript
// Status de uma fila específica
const status = this.resilientQueueService.getBreakerStatus('minha_fila');
console.log(status);
// { open: false, stats: { ... } }

// Status de todas as filas
const todosStatus = this.resilientQueueService.getAllBreakerStatuses();
```

### Estados do Circuit Breaker

- **CLOSED**: Funcionamento normal
- **OPEN**: Falhas excessivas, rejeitando chamadas rapidamente
- **HALF_OPEN**: Testando se o serviço se recuperou

### Logs

O serviço loga automaticamente mudanças de estado:

```
WARN  Queue Circuit Breaker OPEN for queue: minha_fila
LOG   Queue Circuit Breaker HALF_OPEN for queue: minha_fila
LOG   Queue Circuit Breaker CLOSED for queue: minha_fila
```

## Exemplo Completo

Veja `apps/api/src/usuarios/infrastructure/repositories/prisma-usuario-with-events.repository.ts` para um exemplo completo de repository usando:

1. Domain Events para notificar mudanças
2. ResilientQueueService para auditoria (via AuditProducerService)

## Próximos Passos Sugeridos

1. **Criar mais eventos de domínio** para outras entidades (Perfis, Permissões)
2. **Implementar handlers adicionais** para:
   - Envio de emails
   - Notificações push
   - Invalidação de cache
   - Sincronização com serviços externos
3. **Adicionar métricas** dos Circuit Breakers ao endpoint de health check
4. **Criar dashboard** para visualizar status dos Circuit Breakers
