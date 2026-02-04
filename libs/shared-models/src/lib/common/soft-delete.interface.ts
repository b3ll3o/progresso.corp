export interface SoftDeleteInterface {
  ativo: boolean;
  deletedAt?: Date | null;
}
