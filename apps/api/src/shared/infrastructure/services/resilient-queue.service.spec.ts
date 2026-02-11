import { Test, TestingModule } from '@nestjs/testing';
import { ResilientQueueService } from './resilient-queue.service';
import { Queue } from 'bullmq';
import { Logger } from '@nestjs/common';

describe('ResilientQueueService', () => {
  let service: ResilientQueueService;
  let mockQueue: jest.Mocked<Queue>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResilientQueueService],
    }).compile();

    service = module.get<ResilientQueueService>(ResilientQueueService);
    mockQueue = {
      name: 'test-queue',
      add: jest.fn(),
      addBulk: jest.fn(),
    } as any;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log initialization message', () => {
    const loggerSpy = jest.spyOn(Logger.prototype, 'log');
    service.onModuleInit();
    expect(loggerSpy).toHaveBeenCalledWith('ResilientQueueService initialized');
  });

  describe('addToQueue', () => {
    it('should add job to queue successfully', async () => {
      mockQueue.add.mockResolvedValue({ id: '1' } as any);
      await service.addToQueue(mockQueue, 'test-job', { foo: 'bar' });
      expect(mockQueue.add).toHaveBeenCalledWith(
        'test-job',
        { foo: 'bar' },
        expect.any(Object),
      );
    });

    it('should throw error if queue add fails', async () => {
      const error = new Error('Queue error');
      mockQueue.add.mockRejectedValue(error);
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');

      await expect(
        service.addToQueue(mockQueue, 'test-job', { foo: 'bar' }),
      ).rejects.toThrow('Queue error');
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Failed to add job to queue test-queue: Queue error',
        ),
        error.stack,
      );
    });
  });

  describe('addToQueueWithPriority', () => {
    it('should add priority job to queue', async () => {
      mockQueue.add.mockResolvedValue({ id: '1' } as any);
      await service.addToQueueWithPriority(
        mockQueue,
        'test-job',
        { foo: 'bar' },
        10,
      );
      expect(mockQueue.add).toHaveBeenCalledWith(
        'test-job',
        { foo: 'bar' },
        expect.objectContaining({ priority: 10 }),
      );
    });

    it('should throw error if priority add fails', async () => {
      const error = new Error('Priority Queue error');
      mockQueue.add.mockRejectedValue(error);
      await expect(
        service.addToQueueWithPriority(
          mockQueue,
          'test-job',
          { foo: 'bar' },
          10,
        ),
      ).rejects.toThrow('Priority Queue error');
    });
  });

  describe('addBulkToQueue', () => {
    it('should add bulk jobs to queue', async () => {
      mockQueue.addBulk.mockResolvedValue([] as any);
      const jobs = [{ name: 'job1', data: { x: 1 } }];
      await service.addBulkToQueue(mockQueue, jobs);
      expect(mockQueue.addBulk).toHaveBeenCalledWith(jobs);
    });

    it('should throw error if bulk add fails', async () => {
      const error = new Error('Bulk error');
      mockQueue.addBulk.mockRejectedValue(error);
      await expect(service.addBulkToQueue(mockQueue, [])).rejects.toThrow(
        'Bulk error',
      );
    });
  });

  describe('breaker status', () => {
    it("should return null if breaker doesn't exist", () => {
      expect(service.getBreakerStatus('non-existent')).toBeNull();
    });

    it('should return status and stats if breaker exists', async () => {
      // Trigger breaker creation
      mockQueue.add.mockResolvedValue({ id: '1' } as any);
      await service.addToQueue(mockQueue, 'test', {});

      const status = service.getBreakerStatus('test-queue');
      expect(status).toBeDefined();
      expect(status).toHaveProperty('open');
      expect(status).toHaveProperty('stats');
    });

    it('should return all breaker statuses', async () => {
      mockQueue.add.mockResolvedValue({ id: '1' } as any);
      await service.addToQueue(mockQueue, 'test', {});

      const allStatuses = service.getAllBreakerStatuses();
      expect(allStatuses).toHaveProperty('test-queue');
    });
  });
});
