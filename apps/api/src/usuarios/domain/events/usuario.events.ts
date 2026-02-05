import { DomainEvent } from '../../../shared/domain/events/domain-event.base';

export class UsuarioCreatedEvent extends DomainEvent {
  constructor(
    public readonly usuarioId: number,
    public readonly email: string,
    public readonly empresaId?: number,
  ) {
    super();
  }

  getEventName(): string {
    return 'usuario.created';
  }
}

export class UsuarioUpdatedEvent extends DomainEvent {
  constructor(
    public readonly usuarioId: number,
    public readonly email: string,
    public readonly changes: Record<string, any>,
  ) {
    super();
  }

  getEventName(): string {
    return 'usuario.updated';
  }
}

export class UsuarioSoftDeletedEvent extends DomainEvent {
  constructor(
    public readonly usuarioId: number,
    public readonly email: string,
    public readonly deletedAt: Date,
  ) {
    super();
  }

  getEventName(): string {
    return 'usuario.soft_deleted';
  }
}

export class UsuarioRestoredEvent extends DomainEvent {
  constructor(
    public readonly usuarioId: number,
    public readonly email: string,
    public readonly restoredAt: Date,
  ) {
    super();
  }

  getEventName(): string {
    return 'usuario.restored';
  }
}

export class PasswordChangedEvent extends DomainEvent {
  constructor(
    public readonly usuarioId: number,
    public readonly email: string,
    public readonly changedAt: Date,
  ) {
    super();
  }

  getEventName(): string {
    return 'usuario.password_changed';
  }
}

export class UsuarioAddedToEmpresaEvent extends DomainEvent {
  constructor(
    public readonly usuarioId: number,
    public readonly empresaId: number,
    public readonly perfilIds: number[],
  ) {
    super();
  }

  getEventName(): string {
    return 'usuario.added_to_empresa';
  }
}

export class UsuarioRemovedFromEmpresaEvent extends DomainEvent {
  constructor(
    public readonly usuarioId: number,
    public readonly empresaId: number,
  ) {
    super();
  }

  getEventName(): string {
    return 'usuario.removed_from_empresa';
  }
}
