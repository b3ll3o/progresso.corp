import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name?: string;
    access_token: string;
    refresh_token: string;
    empresas: Array<{
      id: string;
      nome: string;
      perfis: Array<{
        codigo: string;
        permissoes: Array<{
          codigo: string;
        }>;
      }>;
    }>;
  }

  interface Session {
    access_token: string;
    refresh_token: string;
    empresas: User['empresas'];
    user: {
      id: string;
      email: string;
      name?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token: string;
    refresh_token: string;
    empresas: User['empresas'];
  }
}
