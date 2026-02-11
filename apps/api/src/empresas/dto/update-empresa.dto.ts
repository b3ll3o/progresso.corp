import { IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateEmpresaDto } from './create-empresa.dto';

export class UpdateEmpresaDto extends PartialType(CreateEmpresaDto) {
  /**
   * Status da empresa
   * @example true
   */
  @IsOptional()
  ativo?: boolean;
}
