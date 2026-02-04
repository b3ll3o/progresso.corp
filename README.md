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
  <strong>Modern Monorepo Architecture with Next.js 15 and NestJS 11</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Nx-22.4.4-blue?logo=nx" alt="Nx Version">
  <img src="https://img.shields.io/badge/Next.js-16.0.1-black?logo=next.js" alt="Next.js Version">
  <img src="https://img.shields.io/badge/NestJS-11.0.0-red?logo=nestjs" alt="NestJS Version">
  <img src="https://img.shields.io/badge/TypeScript-5.9.2-blue?logo=typescript" alt="TypeScript Version">
  <img src="https://img.shields.io/badge/Node.js-20-green?logo=node.js" alt="Node.js Version">
</p>

---

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Development](#development)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Docker](#docker)
- [CI/CD](#cicd)
- [Best Practices](#best-practices)
- [Contributing](#contributing)

## ✨ Features

### Backend (API)
- **NestJS 11** with Fastify adapter for high performance
- **JWT Authentication** with refresh tokens
- **RBAC Authorization** (Role-Based Access Control)
- **Prisma ORM** with PostgreSQL
- **Redis** caching and BullMQ queues
- **OpenAPI/Swagger** documentation
- **Rate limiting** with Throttler
- **Observability**: OpenTelemetry, Sentry, Pino logging
- **Health checks** and graceful shutdown

### Frontend
- **Next.js 15** with App Router and Server Actions
- **React 19** with latest features
- **Tailwind CSS** for styling
- **TypeScript** strict mode
- **Authentication context** with local storage
- **Modern UI** with responsive design

### Infrastructure
- **Nx** monorepo with distributed caching
- **Nx Cloud** for remote caching
- **Docker** multi-stage builds
- **GitHub Actions** CI/CD pipeline
- **Husky** + lint-staged + commitlint

## 🏗 Architecture

```
monorepo/
├── apps/
│   ├── api/              # NestJS backend API
│   ├── frontend/         # Next.js frontend
│   ├── api-e2e/          # API E2E tests
│   └── frontend-e2e/     # Frontend E2E tests
├── libs/
│   ├── shared-models/    # Shared DTOs and types
│   └── shared-utils/     # Shared utility functions
├── docker-compose.yml    # Docker orchestration
└── nx.json              # Nx configuration
```

## 📋 Prerequisites

- **Node.js** 20.x or higher
- **npm** 10.x or higher
- **Docker** and Docker Compose (for local development)
- **Git**

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd monorepo
npm install
```

### 2. Environment Setup

Create a `.env` file in the root:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/progressocorp?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
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

### 3. Start Infrastructure

```bash
npm run docker:up
```

This starts PostgreSQL, Redis, and other services.

### 4. Database Setup

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. Start Development

```bash
# Start both API and Frontend
npm run dev

# Or start individually
npm run dev:api
npm run dev:frontend
```

The applications will be available at:
- **Frontend**: http://localhost:4200
- **API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api/docs

## 💻 Development

### Code Organization

We follow strict organization with Nx tags:

- `scope:api` - API application code
- `scope:frontend` - Frontend application code
- `scope:shared` - Shared libraries
- `type:app` - Applications
- `type:model` - Data models
- `type:util` - Utility libraries

### Dependency Constraints

API can depend on:
- `scope:shared`

Frontend can depend on:
- `scope:shared`

Shared libraries cannot depend on applications.

## 📝 Available Scripts

### Building
```bash
npm run build              # Build all applications
npm run build:api          # Build API only
npm run build:frontend     # Build Frontend only
npm run build:affected     # Build affected by changes
```

### Development
```bash
npm run dev                # Start all in dev mode
npm run dev:api            # Start API only
npm run dev:frontend       # Start Frontend only
```

### Testing
```bash
npm run test               # Run all tests
npm run test:api           # Test API only
npm run test:frontend      # Test Frontend only
npm run test:e2e           # Run E2E tests
npm run test:affected      # Test affected by changes
```

### Code Quality
```bash
npm run lint               # Lint all projects
npm run lint:fix           # Fix linting issues
npm run format             # Format code with Prettier
npm run format:check       # Check formatting
```

### Database
```bash
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run migrations
npm run prisma:push        # Push schema changes
npm run prisma:studio      # Open Prisma Studio
```

### Docker
```bash
npm run docker:up          # Start all services
npm run docker:down        # Stop all services
npm run docker:build       # Build Docker images
npm run docker:logs        # View logs
```

### Nx Commands
```bash
npm run graph              # View project graph
npm run graph:affected     # View affected graph
npm run affected           # Run affected commands
npm run clean              # Clean build cache
```

## 📁 Project Structure

### API (`apps/api`)

```
api/
├── src/
│   ├── auth/              # Authentication module
│   ├── usuarios/          # Users module
│   ├── empresas/          # Companies module
│   ├── perfis/            # Profiles module
│   ├── permissoes/        # Permissions module
│   ├── shared/            # Shared infrastructure
│   │   ├── application/   # Application layer
│   │   ├── domain/        # Domain layer
│   │   └── infrastructure/# Infrastructure layer
│   ├── main.ts           # Application entry
│   └── app.module.ts     # Root module
├── prisma/
│   └── schema.prisma     # Database schema
├── Dockerfile            # Multi-stage Dockerfile
└── project.json          # Nx configuration
```

### Frontend (`apps/frontend`)

```
frontend/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx      # Home page
│   │   ├── layout.tsx    # Root layout
│   │   ├── login/        # Login page
│   │   ├── dashboard/    # Dashboard page
│   │   └── ...
│   ├── components/       # React components
│   │   ├── auth/         # Auth components
│   │   ├── ui/           # UI components
│   │   └── layout/       # Layout components
│   ├── lib/              # Utility functions
│   └── hooks/            # Custom hooks
├── next.config.js        # Next.js configuration
└── tailwind.config.js    # Tailwind CSS config
```

### Shared Libraries

#### `libs/shared-models`
Shared DTOs, interfaces, and types between API and Frontend.

```typescript
import { LoginUsuarioDto, Usuario } from '@monorepo/shared-models';
```

#### `libs/shared-utils`
Shared utility functions.

```typescript
import { isValidEmail, formatDateBR } from '@monorepo/shared-utils';
```

## 🐳 Docker

### Development

```bash
# Start all infrastructure services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Build

```bash
# Build API Docker image
cd apps/api
docker build -t progressocorp-api .

# Run container
docker run -p 3000:3000 --env-file ../../.env progressocorp-api
```

### Services

- **PostgreSQL** (port 5432): Main database
- **Redis** (port 6379): Caching and queues
- **PgAdmin** (port 8081): Database management UI
- **Jaeger** (port 16686): Distributed tracing

## 🔄 CI/CD

GitHub Actions workflow includes:

1. **Lint and Test**: Runs on every PR
   - ESLint
   - Unit tests
   - Build verification

2. **Build**: Runs on main branch
   - Build API and Frontend
   - Upload artifacts

3. **Docker Build**: Validates Docker images

4. **E2E Tests**: Full integration testing
   - Starts PostgreSQL and Redis
   - Runs migrations
   - Executes E2E test suite

### Deployment

The project is configured for easy deployment to:
- **Vercel** (Frontend)
- **Railway/Render/Fly.io** (API)
- **AWS/GCP/Azure** (Full stack)

## 🎯 Best Practices

### Commits

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user authentication
fix: resolve login redirect issue
docs: update API documentation
style: format code with prettier
refactor: simplify auth middleware
perf: optimize database queries
test: add unit tests for auth service
chore: update dependencies
ci: configure GitHub Actions
build: optimize Docker image size
```

### Code Quality

- **ESLint**: Enforces code style
- **Prettier**: Automatic formatting
- **TypeScript**: Strict mode enabled
- **Husky**: Pre-commit hooks
- **lint-staged**: Staged file linting

### Testing Strategy

- **Unit Tests**: Jest for business logic
- **Integration Tests**: Test controllers and services
- **E2E Tests**: Playwright for full workflows
- **Code Coverage**: Minimum 80% coverage

### Security

- JWT tokens with refresh token rotation
- Rate limiting on all endpoints
- Input validation with class-validator
- Password hashing with bcrypt
- CORS configuration
- Helmet for security headers

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feat/new-feature`
2. Make your changes
3. Run tests: `npm run test`
4. Commit with conventional format: `git commit -m "feat: add new feature"`
5. Push to branch: `git push origin feat/new-feature`
6. Open a Pull Request

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Tests
- `chore`: Build/config changes

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@progressocorp.com or join our Slack channel.

---

Built with ❤️ using [Nx](https://nx.dev), [Next.js](https://nextjs.org), and [NestJS](https://nestjs.com)
