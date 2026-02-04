import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUES } from '../../domain/constants/queues.constants';
import { PrismaService } from '../../../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Processor(QUEUES.AUDIT_LOG)
export class AuditConsumer extends WorkerHost {
  private readonly logger = new Logger(AuditConsumer.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    if (job.name === 'log_audit') {
      try {
        await this.prisma.auditLog.create({
          data: job.data,
        });
      } catch (error) {
        this.logger.error(`Failed to process audit log job ${job.id}`, error.stack);
        throw error;
      }
    }
  }
}
