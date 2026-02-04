export interface Usuario {
  id: string;
  email: string;
  senha?: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface UsuarioResponse {
  id: string;
  email: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsuarioWithPerfis extends UsuarioResponse {
  perfis: Perfil[];
}

export interface Perfil {
  id: string;
  nome: string;
  descricao?: string;
  empresaId?: string;
  createdAt: Date;
  updatedAt: Date;
}
