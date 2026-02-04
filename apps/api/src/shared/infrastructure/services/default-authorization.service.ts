import { Injectable } from '@nestjs/common';
import { AuthorizationService } from '../../domain/services/authorization.service';
import { JwtPayload } from '../../types/auth.types';

@Injectable()
export class DefaultAuthorizationService implements AuthorizationService {
  isAdmin(usuario: JwtPayload): boolean {
    return (
      usuario.empresas?.some((e) =>
        e.perfis?.some((p) => p.codigo === 'ADMIN'),
      ) ?? false
    );
  }
}
