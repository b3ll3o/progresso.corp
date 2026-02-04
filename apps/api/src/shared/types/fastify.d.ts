import { JwtPayload } from './auth.types';

declare module 'fastify' {
  interface FastifyRequest {
    usuarioLogado?: JwtPayload;
    user?: JwtPayload;
    empresaContext?: any;
  }
}
