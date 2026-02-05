export class EmpresaCriadaEvent {
  constructor(
    public readonly empresaId: string,
    public readonly nome: string,
    public readonly responsavelId: number,
  ) {}
}

export class UsuarioVinculadoAEmpresaEvent {
  constructor(
    public readonly empresaId: string,
    public readonly usuarioId: number,
    public readonly perfilIds: number[],
  ) {}
}
