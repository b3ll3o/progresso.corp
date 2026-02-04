import { PartialType } from '@nestjs/swagger';
import { CreateEmpresaDto } from './create-empresa.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEmpresaDto extends PartialType(CreateEmpresaDto) {
  @ApiPropertyOptional({
    description: 'Indica se a empresa está ativa ou inativa',
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
