import { Empresa, CreateEmpresaData, UpdateEmpresaData } from '../entities/empresa.entity';

export abstract class EmpresaCommandRepository {
  abstract create(data: CreateEmpresaData): Promise<Empresa>;
  abstract update(id: string, data: UpdateEmpresaData): Promise<Empresa>;
  abstract remove(id: string): Promise<void>;
  abstract addUserToCompany(
    empresaId: string,
    usuarioId: number,
    perfilIds: number[],
  ): Promise<void>;
}
