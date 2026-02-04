export interface JwtPayload {
  email: string;
  userId?: number;
  sub?: number;
  empresas?: {
    id: string;
    perfis?: {
      codigo: string;
      permissoes?: {
        codigo: string;
      }[];
    }[];
  }[];
}
