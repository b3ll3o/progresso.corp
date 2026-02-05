# Guia de Desenvolvimento - Requisitos de Teste

## 🎯 Cobertura Mínima Obrigatória: 80%

Todos os projetos deste repositório devem manter os seguintes níveis mínimos de cobertura de testes:

| Métrica    | Mínimo | Status Atual (API) |
| ---------- | ------ | ------------------ |
| Statements | ≥ 80%  | 89.74% ✅          |
| Branches   | ≥ 80%  | 72.38% ⚠️          |
| Functions  | ≥ 80%  | 88.42% ✅          |
| Lines      | ≥ 80%  | 89.26% ✅          |

---

## 📋 Checklist de Qualidade

### Antes de commitar:

- [ ] Todos os testes passam (`npm test`)
- [ ] Cobertura não diminuiu (`npm run test:cov`)
- [ ] Lint passa (`npm run lint`)
- [ ] Type checking passa (`npx tsc --noEmit`)

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

- ✅ 0 testes falhando
- ✅ Cobertura ≥ 80% em todas as métricas
- ✅ Tempo de execução < 5 minutos
- ✅ 0 flaky tests
- ✅ Todos os arquivos críticos testados

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

- Diminuírem cobertura de testes serão **rejeitados**
- Quebrarem testes existentes serão **rejeitados**
- Não tiverem testes para novas funcionalidades serão **rejeitados**

---

**Data de atualização:** 2026-02-05  
**Versão:** 1.0  
**Responsável:** Tech Lead
