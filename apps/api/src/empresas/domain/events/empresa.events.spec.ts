import {
  EmpresaCreatedEvent,
  EmpresaUpdatedEvent,
  EmpresaActivatedEvent,
  EmpresaDeactivatedEvent,
  EmpresaSoftDeletedEvent,
  EmpresaRestoredEvent,
} from './empresa.events';

describe('Empresa Events', () => {
  describe('EmpresaCreatedEvent', () => {
    it('should create event with all data', () => {
      const event = new EmpresaCreatedEvent(
        1,
        'Empresa Teste',
        '12345678901234',
      );

      expect(event.empresaId).toBe(1);
      expect(event.nome).toBe('Empresa Teste');
      expect(event.cnpj).toBe('12345678901234');
      expect(event.getEventName()).toBe('empresa.created');
      expect(event.occurredOn).toBeInstanceOf(Date);
      expect(event.eventId).toBeDefined();
    });

    it('should have unique eventId for each instance', () => {
      const event1 = new EmpresaCreatedEvent(1, 'Empresa 1', '11111111111111');
      const event2 = new EmpresaCreatedEvent(2, 'Empresa 2', '22222222222222');

      expect(event1.eventId).not.toBe(event2.eventId);
    });
  });

  describe('EmpresaUpdatedEvent', () => {
    it('should create event with all data', () => {
      const changes = { nome: { from: 'Old Name', to: 'New Name' } };
      const event = new EmpresaUpdatedEvent(1, 'Empresa Teste', changes);

      expect(event.empresaId).toBe(1);
      expect(event.nome).toBe('Empresa Teste');
      expect(event.changes).toEqual(changes);
      expect(event.getEventName()).toBe('empresa.updated');
    });

    it('should handle empty changes', () => {
      const event = new EmpresaUpdatedEvent(1, 'Empresa Teste', {});

      expect(event.changes).toEqual({});
    });

    it('should handle multiple changes', () => {
      const changes = {
        nome: { from: 'Old', to: 'New' },
        descricao: { from: 'Old Desc', to: 'New Desc' },
      };
      const event = new EmpresaUpdatedEvent(1, 'Empresa Teste', changes);

      expect(Object.keys(event.changes)).toHaveLength(2);
    });
  });

  describe('EmpresaActivatedEvent', () => {
    it('should create event with all data', () => {
      const activatedAt = new Date('2024-01-01');
      const event = new EmpresaActivatedEvent(1, 'Empresa Teste', activatedAt);

      expect(event.empresaId).toBe(1);
      expect(event.nome).toBe('Empresa Teste');
      expect(event.activatedAt).toBe(activatedAt);
      expect(event.getEventName()).toBe('empresa.activated');
    });

    it('should accept current date as activatedAt', () => {
      const now = new Date();
      const event = new EmpresaActivatedEvent(1, 'Empresa Teste', now);

      expect(event.activatedAt).toBe(now);
    });
  });

  describe('EmpresaDeactivatedEvent', () => {
    it('should create event with all data', () => {
      const deactivatedAt = new Date('2024-01-01');
      const event = new EmpresaDeactivatedEvent(
        1,
        'Empresa Teste',
        deactivatedAt,
      );

      expect(event.empresaId).toBe(1);
      expect(event.nome).toBe('Empresa Teste');
      expect(event.deactivatedAt).toBe(deactivatedAt);
      expect(event.getEventName()).toBe('empresa.deactivated');
    });
  });

  describe('EmpresaSoftDeletedEvent', () => {
    it('should create event with all data', () => {
      const deletedAt = new Date('2024-01-01');
      const event = new EmpresaSoftDeletedEvent(1, 'Empresa Teste', deletedAt);

      expect(event.empresaId).toBe(1);
      expect(event.nome).toBe('Empresa Teste');
      expect(event.deletedAt).toBe(deletedAt);
      expect(event.getEventName()).toBe('empresa.soft_deleted');
    });
  });

  describe('EmpresaRestoredEvent', () => {
    it('should create event with all data', () => {
      const restoredAt = new Date('2024-01-01');
      const event = new EmpresaRestoredEvent(1, 'Empresa Teste', restoredAt);

      expect(event.empresaId).toBe(1);
      expect(event.nome).toBe('Empresa Teste');
      expect(event.restoredAt).toBe(restoredAt);
      expect(event.getEventName()).toBe('empresa.restored');
    });
  });

  describe('Event inheritance', () => {
    it('all events should have occurredOn date', () => {
      const createdEvent = new EmpresaCreatedEvent(
        1,
        'Teste',
        '12345678901234',
      );
      const updatedEvent = new EmpresaUpdatedEvent(1, 'Teste', {});
      const activatedEvent = new EmpresaActivatedEvent(1, 'Teste', new Date());
      const deactivatedEvent = new EmpresaDeactivatedEvent(
        1,
        'Teste',
        new Date(),
      );
      const deletedEvent = new EmpresaSoftDeletedEvent(1, 'Teste', new Date());
      const restoredEvent = new EmpresaRestoredEvent(1, 'Teste', new Date());

      expect(createdEvent.occurredOn).toBeInstanceOf(Date);
      expect(updatedEvent.occurredOn).toBeInstanceOf(Date);
      expect(activatedEvent.occurredOn).toBeInstanceOf(Date);
      expect(deactivatedEvent.occurredOn).toBeInstanceOf(Date);
      expect(deletedEvent.occurredOn).toBeInstanceOf(Date);
      expect(restoredEvent.occurredOn).toBeInstanceOf(Date);
    });

    it('all events should have unique eventIds', () => {
      const events = [
        new EmpresaCreatedEvent(1, 'Teste', '12345678901234'),
        new EmpresaUpdatedEvent(1, 'Teste', {}),
        new EmpresaActivatedEvent(1, 'Teste', new Date()),
        new EmpresaDeactivatedEvent(1, 'Teste', new Date()),
        new EmpresaSoftDeletedEvent(1, 'Teste', new Date()),
        new EmpresaRestoredEvent(1, 'Teste', new Date()),
      ];

      const eventIds = events.map((e) => e.eventId);
      const uniqueEventIds = [...new Set(eventIds)];

      expect(uniqueEventIds).toHaveLength(events.length);
    });
  });

  describe('Event names', () => {
    it('should have correct event names', () => {
      expect(new EmpresaCreatedEvent(1, 'Teste', '123').getEventName()).toBe(
        'empresa.created',
      );
      expect(new EmpresaUpdatedEvent(1, 'Teste', {}).getEventName()).toBe(
        'empresa.updated',
      );
      expect(
        new EmpresaActivatedEvent(1, 'Teste', new Date()).getEventName(),
      ).toBe('empresa.activated');
      expect(
        new EmpresaDeactivatedEvent(1, 'Teste', new Date()).getEventName(),
      ).toBe('empresa.deactivated');
      expect(
        new EmpresaSoftDeletedEvent(1, 'Teste', new Date()).getEventName(),
      ).toBe('empresa.soft_deleted');
      expect(
        new EmpresaRestoredEvent(1, 'Teste', new Date()).getEventName(),
      ).toBe('empresa.restored');
    });
  });
});
