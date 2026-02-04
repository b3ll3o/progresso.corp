export interface BaseEntity {
  id: string | number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface SoftDeleteEntity extends BaseEntity {
  ativo: boolean;
}
