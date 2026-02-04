import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUES } from '../../domain/constants/queues.constants';

@Injectable()
export class AuditProducerService {
  private readonly logger = new Logger(AuditProducerService.name);

  constructor(@InjectQueue(QUEUES.AUDIT_LOG) private readonly auditQueue: Queue) {}

  async log(data: any) {
    try {
      await this.auditQueue.add('log_audit', data, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
      });
    } catch (error) {
      this.logger.error('Error adding audit log to queue', error.stack);
    }
  }
}
