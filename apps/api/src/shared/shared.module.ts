import { Module } from '@nestjs/common';
import { PasswordHasher } from '../shared/domain/services/password-hasher.service';
import { BcryptPasswordHasherService } from '../shared/infrastructure/services/bcrypt-password-hasher.service';
import { AppConfig } from './infrastructure/config/app.config';
import { AuthorizationService } from './domain/services/authorization.service';
import { DefaultAuthorizationService } from './infrastructure/services/default-authorization.service';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from './domain/constants/queues.constants';
import { AuditProducerService } from './infrastructure/queues/audit.producer.service';
import { AuditConsumer } from './infrastructure/queues/audit.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUES.AUDIT_LOG,
    }),
  ],
  providers: [
    {
      provide: PasswordHasher,
      useClass: BcryptPasswordHasherService,
    },
    {
      provide: AuthorizationService,
      useClass: DefaultAuthorizationService,
    },
    AppConfig,
    AuditProducerService,
    AuditConsumer,
  ],
  exports: [
    PasswordHasher,
    AppConfig,
    AuthorizationService,
    AuditProducerService,
  ],
})
export class SharedModule {}
