# Infraestrutura e Serviços - ProgressoCorp

Este documento detalha os componentes de infraestrutura que sustentam a plataforma ProgressoCorp e como eles são configurados.

## 🐳 Orquestração com Podman

Utilizamos **Podman** e **Podman Compose** para gerenciar o ambiente de desenvolvimento local, garantindo paridade com os ambientes de homologação e produção.

### Serviços Principais
- **PostgreSQL (16-alpine)**: Banco de dados relacional. Exposto na porta `5434`.
- **Redis (7-alpine)**: Utilizado para cache de alta performance e como broker para o BullMQ.
- **PgAdmin**: Interface gráfica para gerenciamento do PostgreSQL (acessível em `http://localhost:8081`).

## 📬 Mensageria e Filas (BullMQ)

A aplicação utiliza o **BullMQ** para processamento assíncrono de tarefas pesadas ou que não precisam bloquear a resposta HTTP principal.

### Filas Implementadas:
- **`audit_queue`**: Processa logs de auditoria de forma assíncrona. Toda ação decorada com `@Auditar` gera um job nesta fila.
- **Consumer**: Localizado em `apps/api/src/shared/infrastructure/queues/audit.consumer.ts`.

## 📊 Observabilidade e Tracing

A plataforma utiliza o padrão **OpenTelemetry** para rastreabilidade de ponta a ponta.

### Jaeger
- **Propósito**: Visualização de traces distribuídos. Permite ver quanto tempo cada parte da requisição (controller, service, repository, prisma) levou.
- **Acesso**: `http://localhost:16686`.

### OpenTelemetry Collector
- Atua como um middleware que recebe os dados da aplicação e os despacha para o Jaeger e outros sinks configurados.

## 🛡️ Segurança de Rede

- **Helmet**: Configurado no NestJS para definir headers de segurança (CSP, HSTS, etc.).
- **Rate Limiting**: Implementado via `ThrottlerModule` do NestJS, protegendo endpoints sensíveis contra ataques de força bruta.

## 📂 Gerenciamento de Volumes

Os dados do banco de dados e do Redis são persistidos em volumes nomeados para evitar perda de dados ao reiniciar containers:
- `postgres_data`
- `redis_data`
- `pgadmin_data`
