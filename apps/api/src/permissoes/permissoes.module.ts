import { Module } from '@nestjs/common';
import { PermissoesService } from './application/services/permissoes.service';
import { PermissoesController } from './application/controllers/permissoes.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [PermissoesController],
  providers: [PermissoesService],
  exports: [PermissoesService],
})
export class PermissoesModule {}
