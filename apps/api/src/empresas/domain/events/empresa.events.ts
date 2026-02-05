import { DomainEvent } from '../../../shared/domain/events/domain-event.base';

export class EmpresaCreatedEvent extends DomainEvent {
  constructor(
    public readonly empresaId: number,
    public readonly nome: string,
    public readonly cnpj: string,
  ) {
    super();
  }

  getEventName(): string {
    return 'empresa.created';
  }
}

export class EmpresaUpdatedEvent extends DomainEvent {
  constructor(
    public readonly empresaId: number,
    public readonly nome: string,
    public readonly changes: Record<string, any>,
  ) {
    super();
  }

  getEventName(): string {
    return 'empresa.updated';
  }
}

export class EmpresaActivatedEvent extends DomainEvent {
  constructor(
    public readonly empresaId: number,
    public readonly nome: string,
    public readonly activatedAt: Date,
  ) {
    super();
  }

  getEventName(): string {
    return 'empresa.activated';
  }
}

export class EmpresaDeactivatedEvent extends DomainEvent {
  constructor(
    public readonly empresaId: number,
    public readonly nome: string,
    public readonly deactivatedAt: Date,
  ) {
    super();
  }

  getEventName(): string {
    return 'empresa.deactivated';
  }
}

export class EmpresaSoftDeletedEvent extends DomainEvent {
  constructor(
    public readonly empresaId: number,
    public readonly nome: string,
    public readonly deletedAt: Date,
  ) {
    super();
  }

  getEventName(): string {
    return 'empresa.soft_deleted';
  }
}

export class EmpresaRestoredEvent extends DomainEvent {
  constructor(
    public readonly empresaId: number,
    public readonly nome: string,
    public readonly restoredAt: Date,
  ) {
    super();
  }

  getEventName(): string {
    return 'empresa.restored';
  }
}
