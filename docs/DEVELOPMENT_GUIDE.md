# Guia de Desenvolvimento - ProgressoCorp

Este guia estabelece os padrões e práticas para o desenvolvimento no monorepo ProgressoCorp.

## ❗ Importância da Documentação

**A documentação é um cidadão de primeira classe neste projeto.** 

Qualquer nova funcionalidade, alteração arquitetural ou criação de novos módulos **DEVE** ser acompanhada da atualização da documentação correspondente na pasta `docs/`. 

### Regras de Ouro:
1. **Ponto de Verdade Único**: Toda documentação técnica deve residir em `docs/` na raiz do projeto.
2. **Sincronismo**: O código e a documentação devem evoluir juntos. Um Pull Request que altera lógica mas não atualiza a documentação técnica relevante será considerado incompleto.
3. **Clareza**: Explique não apenas o que o código faz, mas a razão da escolha técnica (o "porquê").

---

## 🛠 Workflow de Desenvolvimento

### 1. Preparação
- Certifique-se de que o Podman está rodando: `npm run podman:up`
- Instale as dependências: `npm install`
- Execute as migrações: `npm run prisma:migrate`

### 2. Criação de Novas Funcionalidades
Utilize as tags do Nx para manter a organização:
- `scope:api`: Lógica de backend.
- `scope:frontend`: Interface de usuário.
- `scope:shared`: Código reutilizável.

### 3. Padrões de Código
- **API**: Seguimos princípios de Clean Architecture. Separe `application` (controllers, services) de `infrastructure` (repositories, external services).
- **Frontend**: Priorize Server Components e use Server Actions para mutações.
- **Shared**: DTOs e tipos devem ser definidos em `libs/shared-models` para garantir consistência entre as pontas.

---

## 🔍 Qualidade e Testes

- **Linting**: Execute `npm run lint` antes de cada commit.
- **Format**: Utilizamos Prettier. O comando `npm run format` garante a consistência visual.
- **Testes**: 
  - Unitários: `nx test <projeto>`
  - E2E: `nx e2e <projeto-e2e>`

## 🚀 Observabilidade e Debugging

- Use o **Jaeger** (`http://localhost:16686`) para analisar gargalos em requisições.
- Verifique os logs do **Pino** no console para rastrear erros.
- Em produção, erros críticos são enviados automaticamente para o **Sentry**.

---

## 📄 Checklist para Commits
- [ ] O código passa no `npm run lint`?
- [ ] Novos testes foram adicionados ou os existentes atualizados?
- [ ] A documentação em `docs/` reflete as mudanças?
- [ ] Variáveis de ambiente novas foram adicionadas ao `.env.example`?
