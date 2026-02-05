import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { EmpresaRepository } from '../../domain/repositories/empresa.repository';
import { CreateEmpresaDto } from '../../dto/create-empresa.dto';
import { UpdateEmpresaDto } from '../../dto/update-empresa.dto';
import { PaginationDto } from '../../../shared/dto/pagination.dto';
import { UsuarioRepository } from '../../../usuarios/domain/repositories/usuario.repository';
import { PerfilRepository } from '../../../perfis/domain/repositories/perfil.repository';
import { AddUsuarioEmpresaDto } from '../../dto/add-usuario-empresa.dto';
import { Empresa } from '../../domain/entities/empresa.entity';

@Injectable()
export class EmpresasService {
  private readonly logger = new Logger(EmpresasService.name);

  constructor(
    private readonly empresaRepository: EmpresaRepository,
    private readonly usuarioRepository: UsuarioRepository,
    private readonly perfilRepository: PerfilRepository,
  ) {}

  async create(createEmpresaDto: CreateEmpresaDto) {
    // Aqui poderíamos usar a entidade para validar antes de persistir
    const novaEmpresa = new Empresa({
      nome: createEmpresaDto.nome,
      descricao: createEmpresaDto.descricao,
      responsavelId: createEmpresaDto.responsavelId,
    });

    try {
      novaEmpresa.validarParaCriacao();
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    const empresa = await this.empresaRepository.create({
      nome: novaEmpresa.nome,
      descricao: novaEmpresa.descricao,
      responsavelId: novaEmpresa.responsavelId,
    });

    this.logger.log(`Empresa criada: ${empresa.nome} (ID: ${empresa.id})`);
    return empresa;
  }

  async findAll(paginationDto: PaginationDto) {
    return this.empresaRepository.findAll(paginationDto);
  }

  async findOne(id: string) {
    const empresa = await this.empresaRepository.findOne(id);
    if (!empresa) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
    }
    return empresa;
  }

  async update(id: string, updateEmpresaDto: UpdateEmpresaDto) {
    await this.findOne(id); // Check existence
    
    const empresa = await this.empresaRepository.update(id, {
      nome: updateEmpresaDto.nome,
      descricao: updateEmpresaDto.descricao,
      ativo: updateEmpresaDto.ativo,
    });
    
    this.logger.log(`Empresa atualizada: ${empresa.nome} (ID: ${id})`);
    return empresa;
  }

  async remove(id: string) {
    const empresaData = await this.findOne(id);
    const empresa = new Empresa(empresaData);
    
    // Usando o comportamento da entidade
    empresa.desativar();
    
    await this.empresaRepository.remove(id);
    this.logger.log(`Empresa removida (soft-delete): ID ${id}`);
  }

  async addUser(empresaId: string, addUsuarioEmpresaDto: AddUsuarioEmpresaDto) {
    const { usuarioId, perfilIds } = addUsuarioEmpresaDto;

    // Validar existência da empresa
    await this.findOne(empresaId);

    // Validar existência do usuário
    const usuario = await this.usuarioRepository.findOne(usuarioId);
    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${usuarioId} não encontrado`);
    }

    // Validar existência dos perfis
    for (const perfilId of perfilIds) {
      const perfil = await this.perfilRepository.findOne(perfilId);
      if (!perfil) {
        throw new NotFoundException(`Perfil com ID ${perfilId} não encontrado`);
      }
    }

    await this.empresaRepository.addUserToCompany(
      empresaId,
      usuarioId,
      perfilIds,
    );
    this.logger.log(
      `Usuário ${usuarioId} adicionado à empresa ${empresaId} com perfis ${perfilIds.join(', ')}`,
    );
  }

  async findUsersByCompany(empresaId: string, paginationDto: PaginationDto) {
    await this.findOne(empresaId); // Valida existência
    return this.empresaRepository.findUsersByCompany(empresaId, paginationDto);
  }

  async findCompaniesByUser(usuarioId: number, paginationDto: PaginationDto) {
    // Validar existência do usuário
    const usuario = await this.usuarioRepository.findOne(usuarioId);
    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${usuarioId} não encontrado`);
    }
    return this.empresaRepository.findCompaniesByUser(usuarioId, paginationDto);
  }
}