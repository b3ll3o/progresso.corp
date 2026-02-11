import { Test, TestingModule } from '@nestjs/testing';
import { AuditInterceptor } from './audit.interceptor';
import { Reflector } from '@nestjs/core';
import { AuditProducerService } from '../queues/audit.producer.service';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('AuditInterceptor', () => {
  let interceptor: AuditInterceptor;
  let reflector: jest.Mocked<Reflector>;
  let auditProducer: jest.Mocked<AuditProducerService>;

  beforeEach(async () => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any;
    auditProducer = {
      log: jest.fn().mockResolvedValue(undefined),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditInterceptor,
        { provide: Reflector, useValue: reflector },
        { provide: AuditProducerService, useValue: auditProducer },
      ],
    }).compile();

    interceptor = module.get<AuditInterceptor>(AuditInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should skip if no audit options are found', async () => {
    reflector.getAllAndOverride.mockReturnValue(null);
    const mockContext: jest.Mocked<ExecutionContext> = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
    const mockNext: jest.Mocked<CallHandler> = {
      handle: jest.fn().mockReturnValue(of('data')),
    };

    await interceptor.intercept(mockContext, mockNext).toPromise();

    expect(mockNext.handle).toHaveBeenCalled();
    expect(auditProducer.log).not.toHaveBeenCalled();
  });

  it('should log audit record after successful execution', async () => {
    const auditOptions = { acao: 'CREATE', recurso: 'USER' };
    reflector.getAllAndOverride.mockReturnValue(auditOptions);

    const mockRequest = {
      usuarioLogado: { userId: 1 },
      method: 'POST',
      url: '/users',
      body: { nome: 'Test', senha: '123' },
      params: { id: '123' },
      ip: '127.0.0.1',
      headers: { 'user-agent': 'jest' },
    };

    const mockContext: jest.Mocked<ExecutionContext> = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as any;

    const mockNext: jest.Mocked<CallHandler> = {
      handle: jest.fn().mockReturnValue(of({ id: 1 })),
    };

    await interceptor.intercept(mockContext, mockNext).toPromise();

    expect(auditProducer.log).toHaveBeenCalledWith(
      expect.objectContaining({
        usuarioId: 1,
        acao: 'CREATE',
        recurso: 'USER',
        recursoId: '123',
      }),
    );

    // Verify sanitization
    const lastCall = (auditProducer.log as jest.Mock).mock.calls[0][0];
    expect(lastCall.detalhes.body.senha).toBe('********');
  });

  it('should fallback to user.sub if userId is missing', async () => {
    reflector.getAllAndOverride.mockReturnValue({ acao: 'A', recurso: 'R' });
    const mockRequest = {
      user: { sub: 'sub-1' },
      headers: {},
    };
    const mockContext: any = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    };
    const mockNext: any = { handle: jest.fn().mockReturnValue(of({})) };

    await interceptor.intercept(mockContext, mockNext).toPromise();
    expect(auditProducer.log).toHaveBeenCalledWith(
      expect.objectContaining({ usuarioId: 'sub-1' }),
    );
  });
});
