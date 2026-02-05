import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Usuario } from '../../domain/entities/usuario.entity';
import { UsuarioRepository } from '../../domain/repositories/usuario.repository';
import { PaginationDto } from '../../../shared/dto/pagination.dto';
import { PaginatedResponseDto } from '../../../shared/dto/paginated-response.dto';
import { UsuarioEmpresa } from '../../domain/entities/usuario-empresa.entity';
import { Perfil } from '../../../perfis/domain/entities/perfil.entity';
import { DomainEventPublisher } from '../../../shared/infrastructure/services/domain-event-publisher.service';
import {
  UsuarioCreatedEvent,
  UsuarioUpdatedEvent,
  UsuarioSoftDeletedEvent,
  UsuarioRestoredEvent,
} from '../../domain/events/usuario.events';

@Injectable()
export class PrismaUsuarioRepositoryWithEvents implements UsuarioRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async create(data: Partial<Usuario>): Promise<Usuario> {
    const { email, senha } = data;
    const usuario = await this.prisma.extended.usuario.create({
      data: {
        email: email as string,
        senha: senha,
      },
    });

    const usuarioEntity = this.mapToEntity(usuario)!;

    // Dispara evento de domínio
    await this.eventPublisher.publish(
      new UsuarioCreatedEvent(usuarioEntity.id, usuarioEntity.email),
    );

    return usuarioEntity;
  }

  async findOne(
    id: number,
    includeDeleted = false,
  ): Promise<Usuario | undefined> {
    const queryResult = includeDeleted
      ? await this.prisma.usuario.findUnique({ where: { id } })
      : await this.prisma.extended.usuario.findUnique({ where: { id } });

    if (!queryResult) return undefined;

    return this.mapToEntity(queryResult) ?? undefined;
  }

  async findAll(
    paginationDto: PaginationDto,
    includeDeleted = false,
  ): Promise<PaginatedResponseDto<Usuario>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const client = includeDeleted
      ? this.prisma.usuario
      : this.prisma.extended.usuario;

    const [items, total] = await Promise.all([
      client.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      client.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: items.map((usuario: any) => this.mapToEntity(usuario)!),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const usuario = await this.prisma.extended.usuario.findUnique({
      where: { email },
    });
    if (!usuario) return null;
    return this.mapToEntity(usuario)!;
  }

  async findByEmailWithPerfisAndPermissoes(
    email: string,
  ): Promise<Usuario | null> {
    const usuario = await this.prisma.extended.usuario.findUnique({
      where: { email },
      include: {
        empresas: {
          include: {
            perfis: {
              include: {
                permissoes: true,
              },
            },
          },
        },
      },
    });
    if (!usuario) return null;

    return this.mapToEntity(usuario)!;
  }

  async update(id: number, data: Partial<Usuario>): Promise<Usuario> {
    const { email, senha, ativo } = data;

    const existingUsuario = await this.findOne(id);
    const changes: Record<string, any> = {};

    if (email && email !== existingUsuario?.email) {
      changes.email = { from: existingUsuario?.email, to: email };
    }
    if (ativo !== undefined && ativo !== existingUsuario?.ativo) {
      changes.ativo = { from: existingUsuario?.ativo, to: ativo };
    }

    const updatedUsuario = await this.prisma.extended.usuario.update({
      where: { id },
      data: {
        email,
        senha,
        ativo,
      },
    });

    const usuarioEntity = this.mapToEntity(updatedUsuario)!;

    // Dispara evento de domínio
    await this.eventPublisher.publish(
      new UsuarioUpdatedEvent(usuarioEntity.id, usuarioEntity.email, changes),
    );

    return usuarioEntity;
  }

  async remove(id: number): Promise<Usuario> {
    try {
      const usuario = await this.findOne(id);

      const softDeletedUsuario = await this.prisma.extended.usuario.delete({
        where: { id },
      });

      const usuarioEntity = this.mapToEntity(softDeletedUsuario)!;

      // Dispara evento de domínio
      await this.eventPublisher.publish(
        new UsuarioSoftDeletedEvent(
          usuarioEntity.id,
          usuario?.email || usuarioEntity.email,
          new Date(),
        ),
      );

      return usuarioEntity;
    } catch (error: any) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        throw new Error(`Usuário com ID ${id} não encontrado.`);
      }
      throw error;
    }
  }

  async restore(id: number): Promise<Usuario> {
    try {
      const restoredUsuario = await this.prisma.usuario.update({
        where: { id },
        data: { deletedAt: null, ativo: true },
      });

      const usuarioEntity = this.mapToEntity(restoredUsuario)!;

      // Dispara evento de domínio
      await this.eventPublisher.publish(
        new UsuarioRestoredEvent(
          usuarioEntity.id,
          usuarioEntity.email,
          new Date(),
        ),
      );

      return usuarioEntity;
    } catch (error: any) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        throw new Error(`Usuário com ID ${id} não encontrado.`);
      }
      throw error;
    }
  }

  private mapToEntity(prismaUsuario: any): Usuario | null {
    if (!prismaUsuario) return null;

    const newUsuario = new Usuario();
    newUsuario.id = prismaUsuario.id;
    newUsuario.email = prismaUsuario.email;
    newUsuario.senha =
      prismaUsuario.senha === null ? undefined : prismaUsuario.senha;
    newUsuario.createdAt = prismaUsuario.createdAt;
    newUsuario.updatedAt = prismaUsuario.updatedAt;
    newUsuario.deletedAt = prismaUsuario.deletedAt;
    newUsuario.ativo = prismaUsuario.ativo;

    if (prismaUsuario.empresas) {
      newUsuario.empresas = prismaUsuario.empresas.map((ue: any) => {
        return new UsuarioEmpresa({
          id: ue.id,
          usuarioId: ue.usuarioId,
          empresaId: ue.empresaId,
          createdAt: ue.createdAt,
          updatedAt: ue.updatedAt,
          perfis: ue.perfis
            ? ue.perfis.map((p: any) => {
                const perfil = new Perfil();
                perfil.id = p.id;
                perfil.nome = p.nome;
                perfil.codigo = p.codigo;
                perfil.descricao = p.descricao;
                perfil.ativo = p.ativo;
                perfil.permissoes = p.permissoes;
                return perfil;
              })
            : [],
        });
      });
    } else {
      newUsuario.empresas = [];
    }

    return newUsuario;
  }
}
