# Guia de Desenvolvimento - Requisitos de Teste

## 🎯 Cobertura Mínima Obrigatória: 80%

### Requisito de Cobertura de Testes Unitários

**TODAS as aplicações deste repositório DEVEM manter pelo menos 80% de cobertura de testes unitários.**

| Métrica    | Mínimo | Status Atual (API) |
| ---------- | ------ | ------------------ |
| Statements | ≥ 80%  | 89.74% ✅          |
| Branches   | ≥ 80%  | 72.38% ⚠️          |
| Functions  | ≥ 80%  | 88.42% ✅          |
| Lines      | ≥ 80%  | 89.26% ✅          |

**⚠️ IMPORTANTE:**

- Pull Requests que diminuírem a cobertura abaixo de 80% serão **REJEITADOS**
- Novas funcionalidades devem incluir testes unitários com cobertura mínima de 80%
- A cobertura será verificada automaticamente em todos os pipelines de CI/CD

---

## 🔄 Testes E2E (End-to-End)

### Requisito de Cobertura E2E

**TODOS os fluxos de negócio mapeados DEVEM estar cobertos por testes E2E.**

### Checklist de Fluxos Obrigatórios:

#### API (apps/api)

- [ ] **Autenticação**
  - [ ] Login com credenciais válidas
  - [ ] Login com credenciais inválidas
  - [ ] Refresh token
  - [ ] Logout

- [ ] **Usuários**
  - [ ] CRUD completo de usuários
  - [ ] Associação de usuários a empresas
  - [ ] Gerenciamento de permissões

- [ ] **Empresas**
  - [ ] CRUD completo de empresas
  - [ ] Soft delete e restauração
  - [ ] Listagem paginada

- [ ] **Perfis**
  - [ ] CRUD completo de perfis
  - [ ] Associação de permissões

- [ ] **Permissões**
  - [ ] Listagem de permissões
  - [ ] Verificação de acesso

### Padrão para Testes E2E:

```typescript
// apps/api-e2e/src/api/fluxos/empresas.spec.ts
describe('Fluxo: Gerenciamento de Empresas (E2E)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    // Setup do ambiente de teste
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Autenticação
    const response = await request(app.getHttpServer()).post('/auth/login').send({ email: 'admin@teste.com', senha: '123456' });

    authToken = response.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('deve criar uma nova empresa', async () => {
    const response = await request(app.getHttpServer())
      .post('/empresas')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Empresa E2E Test',
        cnpj: '12345678901234',
        responsavelId: 1,
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.nome).toBe('Empresa E2E Test');
  });

  it('deve listar empresas com paginação', async () => {
    const response = await request(app.getHttpServer()).get('/empresas?page=1&limit=10').set('Authorization', `Bearer ${authToken}`).expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('total');
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
```

### Requisitos E2E:

1. **Isolamento:** Cada teste E2E deve ser independente
2. **Cleanup:** Dados de teste devem ser limpos após a execução
3. **Banco de Dados:** Usar banco de teste separado
4. **Autenticação:** Simular usuário real completo
5. **Validações:** Verificar status codes, schemas e regras de negócio

### Comandos E2E:

```bash
# Executar todos os testes E2E
npx nx e2e api-e2e

# Executar E2E em modo watch
npx nx e2e api-e2e --watch

# Executar E2E específico
npx nx e2e api-e2e --testPathPattern=empresas
```

---

## 📋 Checklist de Qualidade

### Antes de commitar:

- [ ] **Testes Unitários**
  - [ ] Todos os testes passam (`npm test`)
  - [ ] Cobertura unitária ≥ 80% (`npm run test:cov`)
  - [ ] Novo código tem testes correspondentes

- [ ] **Testes E2E** (se houver novos fluxos)
  - [ ] Todos os testes E2E passam (`npx nx e2e api-e2e`)
  - [ ] Novos fluxos mapeados têm testes E2E
  - [ ] Fluxos críticos estão cobertos

- [ ] **Qualidade de Código**
  - [ ] Lint passa (`npm run lint`)
  - [ ] Type checking passa (`npx tsc --noEmit`)
  - [ ] Código segue padrões do projeto

### Durante Code Review:

- [ ] Código tem testes correspondentes
- [ ] Testes cobrem casos de erro
- [ ] Testes seguem padrão AAA (Arrange-Act-Assert)
- [ ] Nomes de testes são descritivos
- [ ] Mocks são apropriados

---

## 🧪 Padrões de Teste Obrigatórios

### 1. Estrutura AAA (Arrange-Act-Assert)

```typescript
describe('MeuService', () => {
  describe('metodo', () => {
    it('deve fazer algo quando condição', async () => {
      // Arrange
      const input = { id: 1, nome: 'Teste' };
      const expectedOutput = { id: 1, nome: 'Teste', processado: true };
      mockRepository.findById.mockResolvedValue(input);

      // Act
      const result = await service.processar(input.id);

      // Assert
      expect(result).toEqual(expectedOutput);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
    });
  });
});
```

### 2. Organização por Categorias

```typescript
describe('MeuService', () => {
  describe('Happy Path', () => {
    it('should create successfully with valid data', () => {});
    it('should update existing record', () => {});
  });

  describe('Error Cases', () => {
    it('should throw when data is invalid', () => {});
    it('should handle database errors', () => {});
  });

  describe('Edge Cases', () => {
    it('should handle empty arrays', () => {});
    it('should handle null values', () => {});
  });
});
```

### 3. Nomenclatura de Testes

Use descrições claras em português:

- ✅ `deve criar usuário com dados válidos`
- ✅ `deve lançar erro quando email for inválido`
- ❌ `test1`
- ❌ `should work`

---

## 🚫 Anti-Patterns Proibidos

### 1. Testando Comportamento de Mock

❌ **Errado:**

```typescript
test('deve chamar repositório', async () => {
  await service.create(data);
  expect(mockRepository.create).toHaveBeenCalled();
});
```

✅ **Correto:**

```typescript
test('deve criar e retornar entidade', async () => {
  const result = await service.create(data);
  expect(result).toBeInstanceOf(Entity);
  expect(result.id).toBeDefined();
});
```

### 2. Testes Dependentes de Ordem

❌ **Errado:**

```typescript
it('deve criar usuário', async () => {
  user = await service.create(data);
});

it('deve atualizar usuário', async () => {
  await service.update(user.id, newData); // depende do anterior
});
```

✅ **Correto:**

```typescript
it('deve atualizar usuário existente', async () => {
  const user = await service.create(data); // cria próprio contexto
  await service.update(user.id, newData);
});
```

### 3. Mocks Incompletos

❌ **Errado:**

```typescript
const mockResponse = {
  data: { id: 1 },
  // faltam campos
};
```

✅ **Correto:**

```typescript
const mockResponse = {
  data: { id: 1, nome: 'Teste', email: 'teste@teste.com' },
  metadata: { requestId: '123', timestamp: Date.now() },
  status: 'success',
};
```

---

## ⚙️ Configuração Jest

```javascript
// jest.config.cts
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.module.ts', '!src/**/main.ts', '!src/**/*.dto.ts', '!src/**/*.config.ts', '!src/**/__mocks__/**', '!src/**/*.spec.ts'],
};
```

---

## 🔄 TDD - Desenvolvimento Orientado a Testes

Siga o ciclo Red-Green-Refactor:

1. **RED**: Escreva um teste que falha
2. **GREEN**: Escreva código mínimo para passar
3. **REFACTOR**: Limpe o código mantendo os testes verdes

### Regras:

- Nunca escreva código de produção sem um teste falhando primeiro
- Se violar a regra, delete o código e comece de novo
- Não mantenha código "de referência"
- Teste primeiro, sempre!

---

## 📊 Métricas de Sucesso

### Critérios de Aceitação:

#### Testes Unitários:

- ✅ 0 testes falhando
- ✅ Cobertura ≥ 80% em todas as métricas
- ✅ Tempo de execução < 5 minutos
- ✅ 0 flaky tests
- ✅ Todos os arquivos críticos testados

#### Testes E2E:

- ✅ Todos os fluxos mapeados cobertos
- ✅ 0 testes E2E falhando
- ✅ Tempo de execução E2E < 10 minutos
- ✅ Dados de teste isolados
- ✅ Cleanup automático após execução

---

## 🛠️ Comandos Úteis

```bash
# Executar todos os testes
npm run test:api

# Executar com cobertura
npx nx test api --coverage

# Executar testes específicos
npx jest nome-do-arquivo

# Executar em modo watch
npx nx test api --watch

# Verificar lint
npm run lint:api

# Verificar tipos
npx tsc --noEmit -p apps/api/tsconfig.json
```

---

## 📚 Recursos

- [NestJS Testing Documentation](https://docs.nestjs.com/fundamentals/testing)
- [Jest Best Practices](https://jestjs.io/docs/best-practices)
- [Testing Anti-Patterns](../.agent/skills/skills/test-driven-development/testing-anti-patterns.md)
- [TDD Skill](../.agent/skills/skills/test-driven-development/SKILL.md)

---

## 🚨 Penalidades

Pull requests que:

- **Cobertura Unitária:** Diminuírem cobertura abaixo de 80% serão **REJEITADOS**
- **Testes E2E:** Não incluírem testes E2E para novos fluxos de negócio serão **REJEITADOS**
- **Testes Quebrados:** Quebrarem testes existentes (unitários ou E2E) serão **REJEITADOS**
- **Novas Funcionalidades:** Não tiverem testes unitários para novas funcionalidades serão **REJEITADOS**
- **Documentação:** Não atualizarem documentação de fluxos quando necessário serão **REJEITADOS**

### Bloqueios Automáticos em CI/CD:

- Pipeline falha se cobertura < 80%
- Pipeline falha se testes E2E falharem
- Pipeline falha se testes unitários falharem
- Merge bloqueado até todos os checks passarem

---

**Data de atualização:** 2026-02-05
**Versão:** 1.1
**Responsável:** Tech Lead

## 📋 Histórico de Versões

| Versão | Data       | Descrição                                                                |
| ------ | ---------- | ------------------------------------------------------------------------ |
| 1.1    | 2026-02-05 | Adicionado requisito de 80% cobertura unitária e testes E2E obrigatórios |
| 1.0    | 2026-02-05 | Versão inicial com padrões de teste e configuração Jest                  |
