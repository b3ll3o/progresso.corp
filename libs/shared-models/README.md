# @monorepo/shared-models

Biblioteca de modelos de dados, DTOs e interfaces compartilhados entre o Frontend e a API do sistema ProgressoCorp.

## 🚀 Como Usar

```typescript
import { LoginUsuarioDto, Usuario } from '@monorepo/shared-models';
```

## 📁 Conteúdo

### Autenticação (`/auth`)
- `LoginUsuarioDto`: Validação de email e senha para login.
- `RefreshTokenDto`: Estrutura para renovação de tokens.

### Usuários (`/usuarios`)
- `CreateUsuarioDto`: Dados para criação de novo usuário.
- `UpdateUsuarioDto`: Dados para atualização parcial de usuário.
- `Usuario`, `UsuarioResponse`, `UsuarioWithPerfis`: Interfaces de entidade e resposta.

### Empresas (`/empresas`)
- `CreateEmpresaDto`: Dados para criação de empresa.
- `UpdateEmpresaDto`: Dados para atualização de empresa.
- `AddUsuarioEmpresaDto`: Vinculação de usuário a empresa com perfis.

### Perfis e Permissões (`/perfis`, `/permissoes`)
- `CreatePerfilDto`, `UpdatePerfilDto`: Gerenciamento de perfis vinculados a empresas.
- `CreatePermissaoDto`, `UpdatePermissaoDto`: Gerenciamento de ações atômicas.

### Paginação (`/pagination`)
- `PaginationDto`: Query parameters padrão (`page`, `limit`).
- `PaginatedResponseDto<T>`: Wrapper padrão para respostas de listagem.

### Comum (`/common`)
- `BaseEntity`: Campos base (`id`, `createdAt`, `updatedAt`).
- `SoftDeleteInterface`: Campos para deleção lógica (`ativo`, `deletedAt`).
- `ApiResponse<T>`: Tipos genéricos para respostas da API.

## 🛠 Comandos Nx

- **Build**: `nx build shared-models`
- **Lint**: `nx lint shared-models`
- **Test**: `nx test shared-models`