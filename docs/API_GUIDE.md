# Guia de Integração com a API - ProgressoCorp

Este guia fornece informações sobre como integrar-se à API do sistema ProgressoCorp.

## 🛠 Base URL
```
http://localhost:3000/api
```

## 🔒 Autenticação

A API utiliza autenticação JWT. Para acessar a maioria dos endpoints, você deve incluir o token no header `Authorization`.

### 1. Obter Token
Envie uma requisição `POST /auth/login` com as credenciais:
```json
{
  "email": "user@example.com",
  "senha": "password123"
}
```
**Resposta**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
  "refresh_token": "uuid-do-token"
}
```

### 2. Usar o Token
```
Authorization: Bearer <access_token>
```

### 3. Renovação de Token
Envie o `refresh_token` para `POST /auth/refresh` para obter um novo par de tokens.

## 🏢 Contexto de Empresa

Para endpoints que exigem contexto de empresa (como gerenciamento de perfis), envie o header:
```
x-empresa-id: <uuid-da-empresa>
```

## 📄 Paginação

Todos os endpoints de listagem seguem o padrão de paginação:

**Query Params**:
- `page`: Número da página (padrão: 1).
- `limit`: Quantidade de itens por página (padrão: 10).

**Estrutura de Resposta**:
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

## ❌ Tratamento de Erros

A API retorna códigos de status HTTP padrão e um corpo de erro consistente:

```json
{
  "statusCode": 400,
  "timestamp": "2025-09-08T10:00:00Z",
  "path": "/api/endpoint",
  "message": "Mensagem detalhada do erro"
}
```

### Códigos Comuns:
- `400 Bad Request`: Dados de entrada inválidos.
- `401 Unauthorized`: Token ausente ou expirado.
- `403 Forbidden`: Usuário autenticado mas sem permissão para o recurso.
- `404 Not Found`: Recurso não encontrado.
- `409 Conflict`: Violação de unicidade (ex: email já cadastrado).
- `500 Internal Server Error`: Erro inesperado no servidor.

## 📚 Documentação Interativa (Swagger)

A especificação completa OpenAPI está disponível em:
`http://localhost:3000/swagger`
