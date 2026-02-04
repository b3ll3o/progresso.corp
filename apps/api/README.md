# API ProgressoCorp

Backend de alta performance desenvolvido com **NestJS 11** e **Fastify**, parte do ecossistema ProgressoCorp.

## 🚀 Tecnologias

- **Framework**: NestJS 11
- **HTTP Adapter**: Fastify
- **Banco de Dados**: PostgreSQL 16
- **ORM**: Prisma
- **Cache/Filas**: Redis + BullMQ
- **Observabilidade**: OpenTelemetry + Jaeger + Sentry + Pino
- **Segurança**: JWT + RBAC + Throttler + Helmet

## 📁 Estrutura de Módulos

A API é organizada em módulos funcionais:

- **[Auth](./src/auth/README.md)**: Autenticação JWT e proteção de rotas.
- **[Usuários](./src/usuarios/README.md)**: Gestão de perfis de usuários e dados pessoais.
- **[Empresas](./src/empresas/README.md)**: Gerenciamento de entidades empresariais e multi-tenancy.
- **[Perfis](./src/perfis/README.md)**: Grupos de permissões vinculados a empresas.
- **[Permissões](./src/permissoes/README.md)**: Ações atômicas do sistema.
- **[Shared](./src/shared/README.md)**: Componentes comuns (Audit, Interceptors, Filters).

## 🛠 Configuração

### Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env` e ajuste as credenciais.

### Scripts Nx
```bash
# Executar em modo desenvolvimento
nx serve api

# Gerar Cliente Prisma
nx prisma-generate api

# Executar migrações
nx prisma-migrate api

# Testes Unitários
nx test api

# Testes E2E
nx e2e api-e2e
```

## 🐳 Docker

A aplicação possui um `Dockerfile` multi-stage otimizado para produção.

```bash
# Build local
docker build -t progressocorp-api .

# Rodar via compose (na raiz do monorepo)
npm run docker:up
```

## 📊 Observabilidade

### Traces (Jaeger)
A aplicação exporta spans via OpenTelemetry para o coletor configurado. Acesse `http://localhost:16686` para visualizar os traces.

### Health Checks
- Liveness: `GET /health/live`
- Readiness: `GET /health/ready`
- Network: `GET /health/network`
