import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../../shared/types/auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: (ExtractJwt as any).fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const mappedEmpresas = payload.empresas?.map((empresa) => ({
      id: empresa.id,
      perfis: empresa.perfis?.map((perfil) => ({
        codigo: perfil.codigo,
        permissoes: perfil.permissoes?.map((permissao) => ({
          codigo: permissao.codigo,
        })),
      })),
    }));

    return {
      userId: payload.sub,
      email: payload.email,
      empresas: mappedEmpresas,
    };
  }
}
