import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUES } from '../../domain/constants/queues.constants';
import { ResilientQueueService } from '../services/resilient-queue.service';

@Injectable()
export class AuditProducerService {
  private readonly logger = new Logger(AuditProducerService.name);

  constructor(
    @InjectQueue(QUEUES.AUDIT_LOG) private readonly auditQueue: Queue,
    private readonly resilientQueueService: ResilientQueueService,
  ) {}

  async log(data: any) {
    try {
      await this.resilientQueueService.addToQueue(
        this.auditQueue,
        'log_audit',
        data,
        {
          timeout: 10000,
          errorThresholdPercentage: 50,
          resetTimeout: 30000,
        },
      );
    } catch (error: any) {
      this.logger.error('Error adding audit log to queue', error.stack);
    }
  }

  async logBulk(dataArray: any[]) {
    try {
      const jobs = dataArray.map((data) => ({
        name: 'log_audit',
        data,
      }));

      await this.resilientQueueService.addBulkToQueue(this.auditQueue, jobs, {
        timeout: 15000,
        errorThresholdPercentage: 50,
        resetTimeout: 30000,
      });
    } catch (error: any) {
      this.logger.error('Error adding bulk audit logs to queue', error.stack);
    }
  }
}
