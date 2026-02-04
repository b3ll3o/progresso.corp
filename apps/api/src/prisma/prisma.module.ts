import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsuarioRepository } from '../usuarios/domain/repositories/usuario.repository';
import { PrismaUsuarioRepository } from '../usuarios/infrastructure/repositories/prisma-usuario.repository';
import { EmpresaRepository } from '../empresas/domain/repositories/empresa.repository';
import { PrismaEmpresaRepository } from '../empresas/infrastructure/repositories/prisma-empresa.repository';
import { PerfilRepository } from '../perfis/domain/repositories/perfil.repository';
import { PrismaPerfilRepository } from '../perfis/infrastructure/repositories/prisma-perfil.repository';
import { PermissaoRepository } from '../permissoes/domain/repositories/permissao.repository';
import { PrismaPermissaoRepository } from '../permissoes/infrastructure/repositories/prisma-permissao.repository';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: UsuarioRepository,
      useClass: PrismaUsuarioRepository,
    },
    {
      provide: EmpresaRepository,
      useClass: PrismaEmpresaRepository,
    },
    {
      provide: PerfilRepository,
      useClass: PrismaPerfilRepository,
    },
    {
      provide: PermissaoRepository,
      useClass: PrismaPermissaoRepository,
    },
  ],
  exports: [
    PrismaService,
    UsuarioRepository,
    EmpresaRepository,
    PerfilRepository,
    PermissaoRepository,
  ],
})
export class PrismaModule {}