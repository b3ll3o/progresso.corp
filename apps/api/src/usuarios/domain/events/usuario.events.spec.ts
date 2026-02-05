import {
  UsuarioCreatedEvent,
  UsuarioUpdatedEvent,
  UsuarioSoftDeletedEvent,
  UsuarioRestoredEvent,
  PasswordChangedEvent,
  UsuarioAddedToEmpresaEvent,
  UsuarioRemovedFromEmpresaEvent,
} from './usuario.events';

describe('Usuario Events', () => {
  describe('UsuarioCreatedEvent', () => {
    it('should create event with basic data', () => {
      const event = new UsuarioCreatedEvent(1, 'user@test.com');

      expect(event.usuarioId).toBe(1);
      expect(event.email).toBe('user@test.com');
      expect(event.empresaId).toBeUndefined();
      expect(event.getEventName()).toBe('usuario.created');
      expect(event.occurredOn).toBeInstanceOf(Date);
      expect(event.eventId).toBeDefined();
    });

    it('should create event with empresaId', () => {
      const event = new UsuarioCreatedEvent(2, 'user2@test.com', 10);

      expect(event.usuarioId).toBe(2);
      expect(event.email).toBe('user2@test.com');
      expect(event.empresaId).toBe(10);
    });

    it('should have unique eventId for each instance', () => {
      const event1 = new UsuarioCreatedEvent(1, 'user1@test.com');
      const event2 = new UsuarioCreatedEvent(2, 'user2@test.com');

      expect(event1.eventId).not.toBe(event2.eventId);
    });

    it('should have occurredOn close to current time', () => {
      const before = new Date();
      const event = new UsuarioCreatedEvent(1, 'user@test.com');
      const after = new Date();

      expect(event.occurredOn.getTime()).toBeGreaterThanOrEqual(
        before.getTime(),
      );
      expect(event.occurredOn.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('UsuarioUpdatedEvent', () => {
    it('should create event with all data', () => {
      const changes = { nome: { from: 'Old', to: 'New' } };
      const event = new UsuarioUpdatedEvent(1, 'user@test.com', changes);

      expect(event.usuarioId).toBe(1);
      expect(event.email).toBe('user@test.com');
      expect(event.changes).toEqual(changes);
      expect(event.getEventName()).toBe('usuario.updated');
    });

    it('should handle empty changes', () => {
      const event = new UsuarioUpdatedEvent(1, 'user@test.com', {});

      expect(event.changes).toEqual({});
    });

    it('should handle multiple changes', () => {
      const changes = {
        nome: { from: 'Old Name', to: 'New Name' },
        email: { from: 'old@test.com', to: 'new@test.com' },
      };
      const event = new UsuarioUpdatedEvent(1, 'user@test.com', changes);

      expect(Object.keys(event.changes)).toHaveLength(2);
    });
  });

  describe('UsuarioSoftDeletedEvent', () => {
    it('should create event with all data', () => {
      const deletedAt = new Date('2024-01-01');
      const event = new UsuarioSoftDeletedEvent(1, 'user@test.com', deletedAt);

      expect(event.usuarioId).toBe(1);
      expect(event.email).toBe('user@test.com');
      expect(event.deletedAt).toBe(deletedAt);
      expect(event.getEventName()).toBe('usuario.soft_deleted');
    });

    it('should accept current date as deletedAt', () => {
      const now = new Date();
      const event = new UsuarioSoftDeletedEvent(1, 'user@test.com', now);

      expect(event.deletedAt).toBe(now);
    });
  });

  describe('UsuarioRestoredEvent', () => {
    it('should create event with all data', () => {
      const restoredAt = new Date('2024-01-01');
      const event = new UsuarioRestoredEvent(1, 'user@test.com', restoredAt);

      expect(event.usuarioId).toBe(1);
      expect(event.email).toBe('user@test.com');
      expect(event.restoredAt).toBe(restoredAt);
      expect(event.getEventName()).toBe('usuario.restored');
    });
  });

  describe('PasswordChangedEvent', () => {
    it('should create event with all data', () => {
      const changedAt = new Date('2024-01-01');
      const event = new PasswordChangedEvent(1, 'user@test.com', changedAt);

      expect(event.usuarioId).toBe(1);
      expect(event.email).toBe('user@test.com');
      expect(event.changedAt).toBe(changedAt);
      expect(event.getEventName()).toBe('usuario.password_changed');
    });
  });

  describe('UsuarioAddedToEmpresaEvent', () => {
    it('should create event with single perfil', () => {
      const event = new UsuarioAddedToEmpresaEvent(1, 10, [1]);

      expect(event.usuarioId).toBe(1);
      expect(event.empresaId).toBe(10);
      expect(event.perfilIds).toEqual([1]);
      expect(event.getEventName()).toBe('usuario.added_to_empresa');
    });

    it('should create event with multiple perfis', () => {
      const event = new UsuarioAddedToEmpresaEvent(1, 10, [1, 2, 3]);

      expect(event.perfilIds).toHaveLength(3);
      expect(event.perfilIds).toContain(1);
      expect(event.perfilIds).toContain(2);
      expect(event.perfilIds).toContain(3);
    });

    it('should handle empty perfilIds array', () => {
      const event = new UsuarioAddedToEmpresaEvent(1, 10, []);

      expect(event.perfilIds).toEqual([]);
    });
  });

  describe('UsuarioRemovedFromEmpresaEvent', () => {
    it('should create event with all data', () => {
      const event = new UsuarioRemovedFromEmpresaEvent(1, 10);

      expect(event.usuarioId).toBe(1);
      expect(event.empresaId).toBe(10);
      expect(event.getEventName()).toBe('usuario.removed_from_empresa');
    });
  });

  describe('Event inheritance', () => {
    it('all events should have occurredOn date', () => {
      const createdEvent = new UsuarioCreatedEvent(1, 'test@test.com');
      const updatedEvent = new UsuarioUpdatedEvent(1, 'test@test.com', {});
      const deletedEvent = new UsuarioSoftDeletedEvent(
        1,
        'test@test.com',
        new Date(),
      );

      expect(createdEvent.occurredOn).toBeInstanceOf(Date);
      expect(updatedEvent.occurredOn).toBeInstanceOf(Date);
      expect(deletedEvent.occurredOn).toBeInstanceOf(Date);
    });

    it('all events should have unique eventIds', () => {
      const events = [
        new UsuarioCreatedEvent(1, 'test@test.com'),
        new UsuarioUpdatedEvent(1, 'test@test.com', {}),
        new UsuarioSoftDeletedEvent(1, 'test@test.com', new Date()),
        new UsuarioRestoredEvent(1, 'test@test.com', new Date()),
        new PasswordChangedEvent(1, 'test@test.com', new Date()),
        new UsuarioAddedToEmpresaEvent(1, 1, [1]),
        new UsuarioRemovedFromEmpresaEvent(1, 1),
      ];

      const eventIds = events.map((e) => e.eventId);
      const uniqueEventIds = [...new Set(eventIds)];

      expect(uniqueEventIds).toHaveLength(events.length);
    });
  });
});
