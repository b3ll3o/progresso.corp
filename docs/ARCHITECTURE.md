# Arquitetura do Sistema - ProgressoCorp

Este documento descreve a arquitetura técnica do projeto ProgressoCorp, um sistema de gestão empresarial moderno baseado em monorepo.

## 🏗 Estrutura do Monorepo

O projeto utiliza **Nx** para gerenciar o monorepo, permitindo compartilhamento de código eficiente entre frontend e backend.

### Projetos Principais (`apps/`)
- **api**: Backend desenvolvido com **NestJS 11** e **Fastify**. Utiliza **Prisma ORM** para persistência de dados.
- **frontend**: Aplicação web desenvolvida com **Next.js 15 (App Router)** e **React 19**.
- **api-e2e**: Testes de ponta a ponta para a API.
- **frontend-e2e**: Testes de ponta a ponta para o frontend utilizando **Playwright**.

### Bibliotecas Compartilhadas (`libs/`)
- **shared-models**: Contém DTOs, interfaces e tipos TypeScript compartilhados entre API e Frontend.
- **shared-utils**: Funções utilitárias de validação, formatação e manipuladores HTTP.

## 🔒 Segurança e Autenticação

### Autenticação JWT
O sistema utiliza **JSON Web Tokens (JWT)** para autenticação.
- **Access Token**: Curta duração (15m), armazenado na sessão.
- **Refresh Token**: Longa duração (7d), armazenado no banco de dados com rotação e detecção de reuso para máxima segurança.

### Autorização RBAC
O controle de acesso é baseado em funções e permissões (**Role-Based Access Control**):
- **Perfis**: Agrupam permissões (ex: ADMIN, USUARIO).
- **Permissões**: Ações atômicas no sistema (ex: `CREATE_USER`, `READ_EMPRESAS`).
- **Escopo**: O sistema suporta múltiplos perfis por usuário, vinculados a diferentes empresas.

## 🏢 Multi-tenancy (Multi-empresa)

O sistema foi desenhado para ser multi-empresa desde a base:
- Os dados de **Perfis** e **Usuarios** são vinculados a uma `Empresa`.
- A API utiliza o header `x-empresa-id` para determinar o contexto da requisição.
- O `Prisma Service` possui uma extensão customizada que injeta automaticamente filtros de `empresaId` e `deletedAt` (Soft Delete) em todas as queries relevantes.

## 🚀 Tecnologias e Infraestrutura

### Backend Stack
- **NestJS 11**: Framework robusto e escalável.
- **Fastify**: Adaptador HTTP de alta performance.
- **Prisma ORM**: Tipagem forte e produtividade no banco de dados.
- **PostgreSQL 16**: Banco de dados relacional principal.
- **Redis**: Utilizado para cache e filas.
- **BullMQ**: Processamento de tarefas em segundo plano (ex: Audit Logs).

### Frontend Stack
- **Next.js 15**: SSR, ISR e Server Actions para performance otimizada.
- **Tailwind CSS**: Estilização moderna e responsiva.
- **React Hook Form + Zod**: Validação de formulários robusta.
- **NextAuth.js v5**: Integração de autenticação simplificada.

### Observabilidade
- **OpenTelemetry (OTel)**: Coleta de traces distribuídos.
- **Jaeger**: Visualização de traces.
- **Sentry**: Monitoramento de erros em tempo real.
- **Pino**: Logging de alta performance.

## 🔄 Fluxo de Dados (Exemplo: Criação de Empresa)

1. **Frontend**: O usuário preenche o formulário e dispara uma **Server Action**.
2. **Action**: Valida os dados com **Zod** e chama o `apiClient` (`shared-models`).
3. **API**: O `AuthGuard` valida o token e o `PermissaoGuard` verifica se o usuário tem `CREATE_EMPRESA`.
4. **Interceptor**: O `AuditInterceptor` captura a intenção e envia para a fila do **BullMQ**.
5. **Service**: O `EmpresasService` executa a lógica de negócio e chama o `EmpresaRepository`.
6. **Database**: O Prisma insere o registro no PostgreSQL.
7. **Consumer**: O `AuditConsumer` processa a fila e salva o log de auditoria de forma assíncrona.
