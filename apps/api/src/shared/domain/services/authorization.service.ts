import { JwtPayload } from '../../types/auth.types';

export abstract class AuthorizationService {
  abstract isAdmin(usuario: JwtPayload): boolean;
}
