import { Module } from '@nestjs/common';
import { EmpresasService } from './application/services/empresas.service';
import { EmpresasController } from './application/controllers/empresas.controller';
import { PerfisModule } from '../perfis/perfis.module';

@Module({
  imports: [PerfisModule],
  controllers: [EmpresasController],
  providers: [EmpresasService],
  exports: [EmpresasService],
})
export class EmpresasModule {}
