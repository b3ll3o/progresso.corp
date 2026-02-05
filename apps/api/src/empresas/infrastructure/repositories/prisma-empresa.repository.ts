import { Injectable } from '@nestjs/common';
import { EmpresaRepository } from '../../domain/repositories/empresa.repository';
import {
  Empresa,
  CreateEmpresaData,
  UpdateEmpresaData,
} from '../../domain/entities/empresa.entity';
import { PaginationDto } from '../../../shared/dto/pagination.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { PaginatedResponseDto } from '../../../shared/dto/paginated-response.dto';

@Injectable()
export class PrismaEmpresaRepository implements EmpresaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEmpresaData): Promise<Empresa> {
    const createData: any = {
      nome: data.nome,
      responsavelId: data.responsavelId,
    };
    if (data.descricao !== undefined) {
      createData.descricao = data.descricao;
    }
    const empresa = await this.prisma.empresa.create({
      data: createData,
    });
    return new Empresa(empresa);
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<Empresa>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      this.prisma.extended.empresa.count({ where: { deletedAt: null } }),
      this.prisma.extended.empresa.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: items.map((item: any) => new Empresa(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Empresa | null> {
    const empresa = await this.prisma.extended.empresa.findUnique({
      where: { id, deletedAt: null },
    });
    return empresa ? new Empresa(empresa) : null;
  }

  async update(id: string, data: UpdateEmpresaData): Promise<Empresa> {
    const updateData: any = {};
    if (data.nome !== undefined) {
      updateData.nome = data.nome;
    }
    if (data.descricao !== undefined) {
      updateData.descricao = data.descricao;
    }
    if (data.ativo !== undefined) {
      updateData.ativo = data.ativo;
    }
    const empresa = await this.prisma.empresa.update({
      where: { id },
      data: updateData,
    });
    return new Empresa(empresa);
  }

  async remove(id: string): Promise<void> {
    await this.prisma.extended.empresa.delete({
      where: { id },
    });
  }

  async addUserToCompany(
    empresaId: string,
    usuarioId: number,
    perfilIds: number[],
  ): Promise<void> {
    // Usamos uma transação para garantir consistência
    await this.prisma.$transaction(async (tx) => {
      // Remove vínculos anteriores se existirem (ou atualiza)
      await tx.usuarioEmpresa.deleteMany({
        where: { empresaId, usuarioId },
      });

      // Cria o novo vínculo
      await tx.usuarioEmpresa.create({
        data: {
          empresaId,
          usuarioId,
          perfis: {
            connect: perfilIds.map((id) => ({ id })),
          },
        },
      });
    });
  }

  async findUsersByCompany(
    empresaId: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<any>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      this.prisma.usuarioEmpresa.count({ where: { empresaId } }),
      this.prisma.usuarioEmpresa.findMany({
        where: { empresaId },
        include: {
          usuario: {
            select: {
              id: true,
              email: true,
              ativo: true,
            },
          },
          perfis: true,
        },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findCompaniesByUser(
    usuarioId: number,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<any>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      this.prisma.usuarioEmpresa.count({ where: { usuarioId } }),
      this.prisma.usuarioEmpresa.findMany({
        where: { usuarioId },
        include: {
          empresa: true,
          perfis: true,
        },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
