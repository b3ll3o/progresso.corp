import { Test, TestingModule } from '@nestjs/testing';
import { AuditProducerService } from './audit.producer.service';
import { getQueueToken } from '@nestjs/bullmq';
import { QUEUES } from '../../domain/constants/queues.constants';
import { ResilientQueueService } from '../services/resilient-queue.service';
import { Logger } from '@nestjs/common';

describe('AuditProducerService', () => {
  let service: AuditProducerService;
  let mockQueue: any;
  let mockResilientQueueService: jest.Mocked<ResilientQueueService>;

  beforeEach(async () => {
    mockQueue = {
      name: QUEUES.AUDIT_LOG,
    };
    mockResilientQueueService = {
      addToQueue: jest.fn(),
      addBulkToQueue: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditProducerService,
        {
          provide: getQueueToken(QUEUES.AUDIT_LOG),
          useValue: mockQueue,
        },
        {
          provide: ResilientQueueService,
          useValue: mockResilientQueueService,
        },
      ],
    }).compile();

    service = module.get<AuditProducerService>(AuditProducerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('log', () => {
    it('should add audit log to queue', async () => {
      const data = { action: 'test' };
      await service.log(data);
      expect(mockResilientQueueService.addToQueue).toHaveBeenCalledWith(
        mockQueue,
        'log_audit',
        data,
        expect.any(Object),
      );
    });

    it('should log error if addToQueue fails', async () => {
      const error = new Error('Queue error');
      mockResilientQueueService.addToQueue.mockRejectedValue(error);
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');

      await service.log({ action: 'test' });

      expect(loggerSpy).toHaveBeenCalledWith(
        'Error adding audit log to queue',
        error.stack,
      );
    });
  });

  describe('logBulk', () => {
    it('should add bulk logs to queue', async () => {
      const dataArray = [{ action: 'test1' }, { action: 'test2' }];
      await service.logBulk(dataArray);
      expect(mockResilientQueueService.addBulkToQueue).toHaveBeenCalledWith(
        mockQueue,
        expect.any(Array),
        expect.any(Object),
      );
    });

    it('should log error if addBulkToQueue fails', async () => {
      const error = new Error('Bulk Queue error');
      mockResilientQueueService.addBulkToQueue.mockRejectedValue(error);
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');

      await service.logBulk([{ action: 'test' }]);

      expect(loggerSpy).toHaveBeenCalledWith(
        'Error adding bulk audit logs to queue',
        error.stack,
      );
    });
  });
});
