import { Test, TestingModule } from '@nestjs/testing';
import { AuditConsumer } from './audit.consumer';
import { PrismaService } from '../../../prisma/prisma.service';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

describe('AuditConsumer', () => {
  let consumer: AuditConsumer;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditConsumer,
        {
          provide: PrismaService,
          useValue: {
            auditLog: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    consumer = module.get<AuditConsumer>(AuditConsumer);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(consumer).toBeDefined();
  });

  it('should process log_audit job successfully', async () => {
    const job = {
      id: '1',
      name: 'log_audit',
      data: {
        acao: 'TEST',
        recurso: 'TEST_RESOURCE',
        recursoId: '1',
        detalhes: { test: true },
      },
    } as unknown as Job;

    prismaService.auditLog.create.mockResolvedValue({
      id: '1',
      ...job.data,
    } as any);

    await consumer.process(job);

    expect(prismaService.auditLog.create).toHaveBeenCalledWith({
      data: job.data,
    });
  });

  it('should not process unknown job names', async () => {
    const job = {
      id: '1',
      name: 'unknown_job',
      data: {},
    } as unknown as Job;

    await consumer.process(job);

    expect(prismaService.auditLog.create).not.toHaveBeenCalled();
  });

  it('should handle errors during processing', async () => {
    const job = {
      id: '1',
      name: 'log_audit',
      data: {},
    } as unknown as Job;

    const error = new Error('Database error');
    prismaService.auditLog.create.mockRejectedValue(error);
    const loggerSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation();

    await expect(consumer.process(job)).rejects.toThrow(error);

    expect(loggerSpy).toHaveBeenCalledWith(
      `Failed to process audit log job ${job.id}`,
      error.stack,
    );
  });
});
