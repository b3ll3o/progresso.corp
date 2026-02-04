import { Module } from '@nestjs/common';
import { UsuariosService } from './application/services/usuarios.service';
import { UsuariosController } from './application/controllers/usuarios.controller';
import {
  IUsuarioAuthorizationService,
  UsuarioAuthorizationService,
} from './application/services/usuario-authorization.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [UsuariosController],
  providers: [
    UsuariosService,
    {
      provide: IUsuarioAuthorizationService,
      useClass: UsuarioAuthorizationService,
    },
  ],
  exports: [UsuariosService],
})
export class UsuariosModule {}
