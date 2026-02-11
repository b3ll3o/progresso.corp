import { Test, TestingModule } from '@nestjs/testing';
import { DomainEventAuditHandler } from './domain-event-audit.handler';
import { AuditProducerService } from '../queues/audit.producer.service';
import {
  UsuarioCreatedEvent,
  UsuarioUpdatedEvent,
  UsuarioSoftDeletedEvent,
  UsuarioRestoredEvent,
  PasswordChangedEvent,
  UsuarioAddedToEmpresaEvent,
  UsuarioRemovedFromEmpresaEvent,
} from '../../../usuarios/domain/events/usuario.events';
import {
  EmpresaCreatedEvent,
  EmpresaUpdatedEvent,
  EmpresaActivatedEvent,
  EmpresaDeactivatedEvent,
  EmpresaSoftDeletedEvent,
  EmpresaRestoredEvent,
} from '../../../empresas/domain/events/empresa.events';

describe('DomainEventAuditHandler', () => {
  let handler: DomainEventAuditHandler;
  let mockAuditProducer: jest.Mocked<AuditProducerService>;

  beforeEach(async () => {
    mockAuditProducer = {
      log: jest.fn().mockResolvedValue(undefined),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DomainEventAuditHandler,
        {
          provide: AuditProducerService,
          useValue: mockAuditProducer,
        },
      ],
    }).compile();

    handler = module.get<DomainEventAuditHandler>(DomainEventAuditHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('User Events', () => {
    it('handleUsuarioCreated', async () => {
      const event = new UsuarioCreatedEvent(1, 'test@test.com', 101);
      await handler.handleUsuarioCreated(event);
      expect(mockAuditProducer.log).toHaveBeenCalledWith(
        expect.objectContaining({ acao: 'CRIAR', recurso: 'USUARIO' }),
      );
    });

    it('handleUsuarioUpdated', async () => {
      const event = new UsuarioUpdatedEvent(1, 'test@test.com', {
        nome: { from: 'a', to: 'b' },
      });
      await handler.handleUsuarioUpdated(event);
      expect(mockAuditProducer.log).toHaveBeenCalled();
    });

    it('handleUsuarioSoftDeleted', async () => {
      const event = new UsuarioSoftDeletedEvent(1, 'test@test.com', new Date());
      await handler.handleUsuarioSoftDeleted(event);
      expect(mockAuditProducer.log).toHaveBeenCalled();
    });

    it('handleUsuarioRestored', async () => {
      const event = new UsuarioRestoredEvent(1, 'test@test.com', new Date());
      await handler.handleUsuarioRestored(event);
      expect(mockAuditProducer.log).toHaveBeenCalled();
    });

    it('handlePasswordChanged', async () => {
      const event = new PasswordChangedEvent(1, 'test@test.com', new Date());
      await handler.handlePasswordChanged(event);
      expect(mockAuditProducer.log).toHaveBeenCalled();
    });

    it('handleUsuarioAddedToEmpresa', async () => {
      const event = new UsuarioAddedToEmpresaEvent(1, 101, [1]);
      await handler.handleUsuarioAddedToEmpresa(event);
      expect(mockAuditProducer.log).toHaveBeenCalled();
    });

    it('handleUsuarioRemovedFromEmpresa', async () => {
      const event = new UsuarioRemovedFromEmpresaEvent(1, 101);
      await handler.handleUsuarioRemovedFromEmpresa(event);
      expect(mockAuditProducer.log).toHaveBeenCalled();
    });
  });

  describe('Empresa Events', () => {
    it('handleEmpresaCreated', async () => {
      const event = new EmpresaCreatedEvent(101, 'Empresa', '123');
      await handler.handleEmpresaCreated(event);
      expect(mockAuditProducer.log).toHaveBeenCalledWith(
        expect.objectContaining({ acao: 'CRIAR', recurso: 'EMPRESA' }),
      );
    });

    it('handleEmpresaUpdated', async () => {
      const event = new EmpresaUpdatedEvent(101, 'Empresa', {
        nome: { from: 'a', to: 'b' },
      });
      await handler.handleEmpresaUpdated(event);
      expect(mockAuditProducer.log).toHaveBeenCalled();
    });

    it('handleEmpresaActivated', async () => {
      const event = new EmpresaActivatedEvent(101, 'Empresa', new Date());
      await handler.handleEmpresaActivated(event);
      expect(mockAuditProducer.log).toHaveBeenCalled();
    });

    it('handleEmpresaDeactivated', async () => {
      const event = new EmpresaDeactivatedEvent(101, 'Empresa', new Date());
      await handler.handleEmpresaDeactivated(event);
      expect(mockAuditProducer.log).toHaveBeenCalled();
    });

    it('handleEmpresaSoftDeleted', async () => {
      const event = new EmpresaSoftDeletedEvent(101, 'Empresa', new Date());
      await handler.handleEmpresaSoftDeleted(event);
      expect(mockAuditProducer.log).toHaveBeenCalled();
    });

    it('handleEmpresaRestored', async () => {
      const event = new EmpresaRestoredEvent(101, 'Empresa', new Date());
      await handler.handleEmpresaRestored(event);
      expect(mockAuditProducer.log).toHaveBeenCalled();
    });
  });
});
