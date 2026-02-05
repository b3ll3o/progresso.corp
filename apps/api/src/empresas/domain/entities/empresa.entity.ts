export interface CreateEmpresaData {
  nome: string;
  descricao?: string | null;
  responsavelId: number;
}

export interface UpdateEmpresaData {
  nome?: string;
  descricao?: string | null;
  ativo?: boolean;
}

export class Empresa {
  id: string;
  nome: string;
  descricao?: string | null;
  ativo: boolean;
  responsavelId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(partial: Partial<Empresa>) {
    Object.assign(this, partial);
    
    // Invariante básica: Toda empresa deve estar ativa por padrão se não especificado
    if (this.ativo === undefined) {
      this.ativo = true;
    }
  }

  /**
   * Regra de Negócio: Uma empresa só pode ser desativada se não houver impedimentos.
   * Aqui poderíamos adicionar lógicas complexas.
   */
  desativar() {
    this.ativo = false;
    this.deletedAt = new Date();
  }

  ativar() {
    this.ativo = true;
    this.deletedAt = null;
  }

  validarParaCriacao() {
    if (!this.nome || this.nome.length < 3) {
      throw new Error('O nome da empresa deve ter pelo menos 3 caracteres.');
    }
  }
}