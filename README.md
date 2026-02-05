# ProgressoCorp - Monorepo

<p align="center">
  <a href="https://nx.dev" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="60" alt="Nx Logo">
  </a>
  <a href="https://nextjs.org" target="_blank" rel="noreferrer">
    <img src="https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png" width="60" alt="Next.js Logo">
  </a>
  <a href="https://nestjs.com" target="_blank" rel="noreferrer">
    <img src="https://nestjs.com/img/logo-small.svg" width="60" alt="NestJS Logo">
  </a>
</p>

<p align="center">
  <strong>Arquitetura Monorepo Moderna com Next.js 15 e NestJS 11</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Nx-22.4.4-blue?logo=nx" alt="Nx Version">
  <img src="https://img.shields.io/badge/Next.js-16.0.1-black?logo=next.js" alt="Next.js Version">
  <img src="https://img.shields.io/badge/NestJS-11.0.0-red?logo=nestjs" alt="NestJS Version">
  <img src="https://img.shields.io/badge/TypeScript-5.9.2-blue?logo=typescript" alt="TypeScript Version">
  <img src="https://img.shields.io/badge/Node.js-20-green?logo=node.js" alt="Node.js Version">
</p>

---

## 📋 Índice

- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Documentação e Guias](#-documentação-e-guias)
- [Pré-requisitos](#pré-requisitos)
- [Primeiros Passos](#primeiros-passos)
- [Desenvolvimento](#desenvolvimento)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Podman](#podman)
- [CI/CD](#cicd)
- [Melhores Práticas](#melhores-práticas)
- [Contribuição](#contribuição)

---

## 📚 Documentação e Guias

Para entender mais profundamente o projeto, consulte nossos guias detalhados na pasta `docs/`:

- **[Guia de Arquitetura](./docs/ARCHITECTURE.md)**: Visão geral técnica, segurança, multi-tenancy e fluxo de dados.
- **[Guia de Integração API](./docs/API_GUIDE.md)**: Autenticação, paginação, erros e Swagger.
- **[Relatório de Melhorias](./docs/MELHORIAS.md)**: Resumo das atualizações tecnológicas e arquiteturais aplicadas.
- **[Agentes de IA](./docs/AGENTS.md)**: Documentação sobre a integração e uso de agentes de inteligência artificial.

---

## ✨ Funcionalidades

### Backend (API)
- **NestJS 11** com adaptador Fastify para alta performance.
- **Autenticação JWT** com rotação de refresh tokens.
- **Autorização RBAC** (Role-Based Access Control).
- **Prisma ORM** com PostgreSQL.
- **Redis** para caching e filas BullMQ.
- **Documentação OpenAPI/Swagger**.
- **Rate limiting** com Throttler.
- **Observabilidade**: OpenTelemetry, Sentry, logging com Pino.
- **Health checks** e graceful shutdown.

### Frontend
- **Next.js 15** com App Router e Server Actions.
- **React 19** com as funcionalidades mais recentes.
- **Tailwind CSS** para estilização.
- **TypeScript** em modo estrito.
- **Contexto de Autenticação** integrado.
- **UI Moderna** com design responsivo.

### Infraestrutura
- **Nx** monorepo com cache distribuído.
- **Nx Cloud** para cache remoto.
- **Podman** para orquestração de containers local.
- **GitHub Actions** para pipeline de CI/CD.
- **Husky** + lint-staged + commitlint.

## 🏗 Arquitetura

```
monorepo/
├── apps/
│   ├── api/              # Backend API NestJS
│   ├── frontend/         # Frontend Next.js
│   ├── api-e2e/          # Testes E2E da API
│   └── frontend-e2e/     # Testes E2E do Frontend
├── libs/
│   ├── shared-models/    # DTOs e tipos compartilhados
│   └── shared-utils/     # Funções utilitárias compartilhadas
├── docs/                 # Documentação do projeto
├── .agents/              # Agentes de IA e ferramentas relacionadas
├── podman-compose.yml    # Orquestração Podman
└── nx.json              # Configuração do Nx
```

## 📋 Pré-requisitos

- **Node.js** 20.x ou superior.
- **npm** 10.x ou superior.
- **Podman** e Podman Compose (para desenvolvimento local).
- **Git**.

## 🚀 Primeiros Passos

### 1. Clonar e Instalar

```bash
git clone <repository-url>
cd monorepo
npm install
```

### 2. Configuração de Ambiente

Crie um arquivo `.env` na raiz:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/progressocorp?schema=public"

# JWT
JWT_SECRET="sua-chave-secreta-jwt"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Redis
REDIS_URL="redis://localhost:6379"

# API
API_PORT=3000
API_URL="http://localhost:3000"

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 3. Iniciar Infraestrutura

```bash
npm run podman:up
```

*Nota: O comando utiliza `podman-compose` internamente.*

### 4. Configurar Banco de Dados

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. Iniciar Desenvolvimento

```bash
# Iniciar API e Frontend simultaneamente
npm run dev

# Ou iniciar individualmente
npm run dev:api
npm run dev:frontend
```

As aplicações estarão disponíveis em:
- **Frontend**: http://localhost:4200
- **API**: http://localhost:3000
- **Documentação API**: http://localhost:3000/api/docs

## 💻 Desenvolvimento

### Organização de Código

Seguimos uma organização rigorosa com tags do Nx:

- `scope:api` - Código da aplicação API.
- `scope:frontend` - Código da aplicação Frontend.
- `scope:shared` - Bibliotecas compartilhadas.
- `type:app` - Aplicações.
- `type:model` - Modelos de dados.
- `type:util` - Bibliotecas utilitárias.

## 📝 Scripts Disponíveis

### Build
```bash
npm run build              # Build de todas as aplicações
npm run build:api          # Build apenas da API
npm run build:frontend     # Build apenas do Frontend
```

### Desenvolvimento
```bash
npm run dev                # Inicia tudo em modo dev
npm run dev:api            # Inicia apenas a API
npm run dev:frontend       # Inicia apenas o Frontend
```

### Testes
```bash
npm run test               # Executa todos os testes
npm run test:api           # Testes da API
npm run test:frontend      # Testes do Frontend
npm run test:e2e           # Executa testes E2E
```

### Qualidade de Código
```bash
npm run lint               # Lint em todos os projetos
npm run lint:fix           # Corrige problemas de lint
npm run format             # Formata o código com Prettier
```

### Banco de Dados
```bash
npm run prisma:generate    # Gera o cliente Prisma
npm run prisma:migrate     # Executa migrações
npm run prisma:studio      # Abre o Prisma Studio
```

### Podman
```bash
npm run podman:up          # Inicia todos os serviços (PostgreSQL, Redis, etc)
npm run podman:down        # Para os serviços
npm run podman:build       # Build das imagens
npm run podman:logs        # Visualiza os logs
```

## 🐳 Podman

Este projeto utiliza **Podman** para o ambiente de desenvolvimento.

### Comandos Comuns

```bash
# Iniciar infraestrutura
podman-compose up -d

# Visualizar logs
podman-compose logs -f

# Parar serviços
podman-compose down
```

### Serviços Disponíveis

- **PostgreSQL** (porta 5432): Banco de dados principal.
- **Redis** (porta 6379): Cache e filas.
- **PgAdmin** (porta 8081): Interface de gerenciamento do banco.
- **Jaeger** (porta 16686): Tracing distribuído.

## 🔄 CI/CD

O workflow do GitHub Actions inclui:

1. **Lint e Testes**: Executado em cada PR.
2. **Build**: Executado na branch principal.
3. **Validação de Containers**: Verifica se as imagens constroem corretamente.

## 🎯 Melhores Práticas

### Commits

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona autenticação de usuário
fix: resolve problema de redirecionamento no login
docs: atualiza documentação da API
```

### Segurança

- Tokens JWT com rotação de refresh tokens.
- Rate limiting em todos os endpoints.
- Validação de input com class-validator.
- Hashing de senhas com bcrypt.
- Configuração de CORS e Helmet.

## 🤝 Contribuição

1. Crie uma branch para a funcionalidade: `git checkout -b feat/nova-funcionalidade`
2. Realize suas alterações.
3. Execute os testes: `npm run test`
4. Commit com formato convencional: `git commit -m "feat: adiciona nova funcionalidade"`
5. Envie para o repositório: `git push origin feat/nova-funcionalidade`
6. Abra um Pull Request.

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

---

Desenvolvido com ❤️ utilizando [Nx](https://nx.dev), [Next.js](https://nextjs.org) e [NestJS](https://nestjs.com)