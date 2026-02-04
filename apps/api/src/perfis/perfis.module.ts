import { Module } from '@nestjs/common';
import { PerfisService } from './application/services/perfis.service';
import { PerfisController } from './application/controllers/perfis.controller';
import { PermissoesModule } from '../permissoes/permissoes.module';

@Module({
  imports: [PermissoesModule],
  controllers: [PerfisController],
  providers: [PerfisService],
  exports: [PerfisService],
})
export class PerfisModule {}
