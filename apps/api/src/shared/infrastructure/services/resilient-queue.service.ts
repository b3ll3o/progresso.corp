import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import CircuitBreaker from 'opossum';

interface CircuitBreakerOptions {
  timeout?: number;
  errorThresholdPercentage?: number;
  resetTimeout?: number;
}

@Injectable()
export class ResilientQueueService implements OnModuleInit {
  private readonly logger = new Logger(ResilientQueueService.name);
  private breakers = new Map<string, any>();

  private readonly defaultOptions: CircuitBreakerOptions = {
    timeout: 10000, // 10 seconds
    errorThresholdPercentage: 50,
    resetTimeout: 30000, // 30 seconds
  };

  onModuleInit() {
    this.logger.log('ResilientQueueService initialized');
  }

  getOrCreateBreaker(queueName: string, options?: CircuitBreakerOptions): any {
    if (!this.breakers.has(queueName)) {
      const breaker = new CircuitBreaker(
        async (operation: () => Promise<any>) => operation(),
        {
          ...this.defaultOptions,
          ...options,
        },
      );

      breaker.on('open', () =>
        this.logger.warn(`Queue Circuit Breaker OPEN for queue: ${queueName}`),
      );
      breaker.on('halfOpen', () =>
        this.logger.log(
          `Queue Circuit Breaker HALF_OPEN for queue: ${queueName}`,
        ),
      );
      breaker.on('close', () =>
        this.logger.log(`Queue Circuit Breaker CLOSED for queue: ${queueName}`),
      );

      this.breakers.set(queueName, breaker);
    }

    return this.breakers.get(queueName)!;
  }

  async addToQueue<T>(
    queue: Queue,
    jobName: string,
    data: T,
    options?: CircuitBreakerOptions,
  ): Promise<void> {
    const breaker = this.getOrCreateBreaker(queue.name, options);

    try {
      await breaker.fire(async () => {
        await queue.add(jobName, data, {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          removeOnComplete: true,
        });
      });
    } catch (error: any) {
      this.logger.error(
        `Failed to add job to queue ${queue.name}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async addToQueueWithPriority<T>(
    queue: Queue,
    jobName: string,
    data: T,
    priority: number,
    options?: CircuitBreakerOptions,
  ): Promise<void> {
    const breaker = this.getOrCreateBreaker(queue.name, options);

    try {
      await breaker.fire(async () => {
        await queue.add(jobName, data, {
          priority,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          removeOnComplete: true,
        });
      });
    } catch (error: any) {
      this.logger.error(
        `Failed to add priority job to queue ${queue.name}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async addBulkToQueue<T>(
    queue: Queue,
    jobs: Array<{ name: string; data: T; opts?: any }>,
    options?: CircuitBreakerOptions,
  ): Promise<void> {
    const breaker = this.getOrCreateBreaker(queue.name, options);

    try {
      await breaker.fire(async () => {
        await queue.addBulk(jobs);
      });
    } catch (error: any) {
      this.logger.error(
        `Failed to add bulk jobs to queue ${queue.name}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  getBreakerStatus(queueName: string): { open: boolean; stats: any } | null {
    const breaker = this.breakers.get(queueName);
    if (!breaker) return null;

    return {
      open: breaker.opened,
      stats: breaker.stats,
    };
  }

  getAllBreakerStatuses(): Record<string, { open: boolean; stats: any }> {
    const statuses: Record<string, { open: boolean; stats: any }> = {};

    for (const [queueName, breaker] of this.breakers.entries()) {
      statuses[queueName] = {
        open: breaker.opened,
        stats: breaker.stats,
      };
    }

    return statuses;
  }
}
