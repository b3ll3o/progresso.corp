# Frontend ProgressoCorp

Frontend moderno construído com Next.js 15, React 19 e Tailwind CSS.

## 🚀 Funcionalidades Implementadas

### ✅ 1. Autenticação JWT
- Login com NextAuth.js v5
- Proteção de rotas via middleware
- Gerenciamento de sessão
- Logout

### ✅ 2. API Client
- Server-side API client (`lib/api/server-api.ts`)
- Métodos pré-configurados para todos os endpoints
- Tratamento de erros
- Cache com revalidate

### ✅ 3. Server Actions
- Mutations para criação, atualização e exclusão
- Validação com Zod
- Revalidate de cache automático
- Redirects automáticos

### ✅ 4. Formulários com Validação
- React Hook Form + Zod Resolver
- Validação em tempo real
- Feedback de erros
- Estados de loading

### ✅ 5. Data Fetching
- Server Components com fetch direto
- Paginação integrada
- Error handling
- Loading states

### ✅ 6. Sistema de Permissões
- Hook `usePermissions` para verificar permissões
- Componentes `PermissionGuard`, `PermissionAnyGuard`, `PermissionAllGuard`
- Verificação em tempo real das permissões do usuário

### ✅ 7. Componentes UI
- Button (com variantes e loading)
- Input (com label e error)
- Card (container flexível)
- Pagination (navegação de páginas)
- SearchFilter (busca/filtro)

### ✅ 8. Layout Dashboard
- Sidebar com navegação
- Header com info do usuário
- Layout responsivo
- Seletor de empresa

## 📁 Estrutura

```
src/
├── app/
│   ├── actions/           # Server Actions
│   │   ├── usuarios.ts
│   │   ├── empresas.ts
│   │   ├── perfis.ts
│   │   └── permissoes.ts
│   ├── (dashboard)/       # Grupo de rotas protegidas
│   │   ├── layout.tsx     # Layout do dashboard
│   │   ├── page.tsx       # Dashboard home
│   │   ├── usuarios/
│   │   ├── empresas/
│   │   ├── perfis/
│   │   └── permissoes/
│   ├── login/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── forms/             # Formulários
│   │   ├── usuario-form.tsx
│   │   ├── empresa-form.tsx
│   │   ├── perfil-form.tsx
│   │   └── permissao-form.tsx
│   ├── ui/                # Componentes base
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── pagination.tsx
│   │   └── search-filter.tsx
│   ├── layout/            # Layout components
│   │   ├── sidebar.tsx
│   │   └── header.tsx
│   └── permission-guard.tsx
├── hooks/
│   └── use-permissions.ts
├── lib/
│   ├── api/
│   │   └── server-api.ts  # API Client
│   ├── auth/
│   │   └── auth.ts        # NextAuth config
│   └── utils.ts
└── types/
    └── auth.d.ts
```

## 🎯 Como Usar

### Autenticação
```typescript
import { signIn, signOut, useSession } from 'next-auth/react';

// Login
await signIn('credentials', { email, senha });

// Logout
await signOut();

// Verificar sessão
const { data: session } = useSession();
```

### API Client
```typescript
import { api } from '@/lib/api/server-api';

// Server Component
const usuarios = await api.usuarios.list({ page: 1, limit: 10 });
```

### Server Actions
```typescript
import { createUsuario } from '@/app/actions/usuarios';

// Form
<form action={createUsuario}>
  <input name="email" />
  <input name="senha" type="password" />
  <button type="submit">Criar</button>
</form>
```

### Permissões
```typescript
import { usePermissions } from '@/hooks/use-permissions';
import { PermissionGuard } from '@/components/permission-guard';

// Hook
const { hasPermission } = usePermissions();
if (hasPermission('CREATE_USUARIO')) { ... }

// Componente
<PermissionGuard permission="CREATE_USUARIO">
  <Button>Criar Usuário</Button>
</PermissionGuard>
```

### Paginação
```typescript
import { Pagination } from '@/components/ui/pagination';

<Pagination
  currentPage={page}
  totalPages={totalPages}
  baseUrl="/usuarios"
/>
```

## 🛠 Scripts

```bash
# Desenvolvimento
npm run dev:frontend

# Build
npm run build:frontend

# Testes
npm run test:frontend
```

## 📦 Dependências

- next-auth@beta
- react-hook-form
- @hookform/resolvers
- zod
- sonner
- lucide-react
- clsx
- tailwind-merge

## 🔐 Variáveis de Ambiente

```env
API_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:4200
NEXTAUTH_SECRET=sua-chave-secreta
```

## 🎨 Design System

### Cores
- Primária: Blue-600 (#2563eb)
- Sucesso: Green-600 (#16a34a)
- Erro: Red-600 (#dc2626)
- Aviso: Yellow-500 (#eab308)

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 📝 Licença

MIT
