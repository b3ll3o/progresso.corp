import { Test, TestingModule } from '@nestjs/testing';
import { PrismaPerfilRepository } from './prisma-perfil.repository';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePerfilDto } from '../../dto/create-perfil.dto';
import { UpdatePerfilDto } from '../../dto/update-perfil.dto';

describe('PrismaPerfilRepository', () => {
  let repository: PrismaPerfilRepository;

  const mockPerfilModel = {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    delete: jest.fn(),
  };

  const mockPerfil = {
    id: 1,
    nome: 'Admin',
    codigo: 'ADMIN',
    descricao: 'Administrador',
    deletedAt: null,
    ativo: true,
    empresaId: 'empresa-1',
    permissoes: [],
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaPerfilRepository,
        {
          provide: PrismaService,
          useValue: {
            perfil: mockPerfilModel,
            extended: {
              perfil: mockPerfilModel,
            },
          },
        },
      ],
    }).compile();

    repository = module.get<PrismaPerfilRepository>(PrismaPerfilRepository);
  });

  it('deve ser definido', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um perfil com permissões', async () => {
      const createPerfilDto: CreatePerfilDto = {
        nome: 'Admin',
        codigo: 'ADMIN',
        descricao: 'Administrador',
        permissoesIds: [1, 2],
        empresaId: 'empresa-1',
      };

      mockPerfilModel.create.mockResolvedValue({
        ...mockPerfil,
        permissoes: [{ id: 1 }, { id: 2 }],
      });

      const result = await repository.create(createPerfilDto);

      expect(result.nome).toBe(createPerfilDto.nome);
      expect(mockPerfilModel.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista de perfis e o total', async () => {
      mockPerfilModel.findMany.mockResolvedValue([mockPerfil]);
      mockPerfilModel.count.mockResolvedValue(1);

      const [result, total] = await repository.findAll(0, 10);

      expect(result).toHaveLength(1);
      expect(total).toBe(1);
    });

    it('deve filtrar por empresaId se fornecido', async () => {
      mockPerfilModel.findMany.mockResolvedValue([mockPerfil]);
      mockPerfilModel.count.mockResolvedValue(1);

      await repository.findAll(0, 10, false, 'empresa-1');

      expect(mockPerfilModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ empresaId: 'empresa-1' }),
        }),
      );
    });

    it('deve incluir deletados se solicitado', async () => {
      mockPerfilModel.findMany.mockResolvedValue([mockPerfil]);
      mockPerfilModel.count.mockResolvedValue(1);

      await repository.findAll(0, 10, true);

      expect(mockPerfilModel.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um perfil se encontrado', async () => {
      mockPerfilModel.findFirst.mockResolvedValue(mockPerfil);
      const result = await repository.findOne(1);
      expect(result?.id).toBe(1);
    });

    it('deve retornar undefined se não encontrado', async () => {
      mockPerfilModel.findFirst.mockResolvedValue(null);
      const result = await repository.findOne(1);
      expect(result).toBeUndefined();
    });

    it('deve buscar perfil incluindo deletados', async () => {
      mockPerfilModel.findFirst.mockResolvedValue(mockPerfil);
      const result = await repository.findOne(1, true);
      expect(result).toBeDefined();
    });
  });

  describe('update', () => {
    it('deve atualizar um perfil com sucesso', async () => {
      const dto: UpdatePerfilDto = { nome: 'Novo Nome' };
      mockPerfilModel.findFirst.mockResolvedValue(mockPerfil);
      mockPerfilModel.update.mockResolvedValue({
        ...mockPerfil,
        nome: 'Novo Nome',
      });

      const result = await repository.update(1, dto);

      expect(result?.nome).toBe('Novo Nome');
      expect(mockPerfilModel.update).toHaveBeenCalled();
    });

    it('deve retornar undefined se o perfil não existir', async () => {
      mockPerfilModel.findFirst.mockResolvedValue(null);
      const result = await repository.update(99, {});
      expect(result).toBeUndefined();
    });

    it('deve relançar erro se não for P2025', async () => {
      const error = new Error('Database Error');
      mockPerfilModel.findFirst.mockResolvedValue(mockPerfil);
      mockPerfilModel.update.mockRejectedValue(error);

      await expect(repository.update(1, {})).rejects.toThrow('Database Error');
    });

    it('deve retornar undefined se update falhar com P2025 (embora verificado antes)', async () => {
      const error = new Error('Not Found');
      (error as any).code = 'P2025';
      mockPerfilModel.findFirst.mockResolvedValue(mockPerfil);
      mockPerfilModel.update.mockRejectedValue(error);

      const result = await repository.update(1, {});
      expect(result).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('deve realizar soft delete chamando delete do client estendido', async () => {
      mockPerfilModel.delete.mockResolvedValue({
        ...mockPerfil,
        ativo: false,
        deletedAt: new Date(),
      });

      const result = await repository.remove(1);

      expect(result.ativo).toBe(false);
      expect(mockPerfilModel.delete).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
        }),
      );
    });

    it('deve lançar erro customizado se perfil não encontrado (P2025)', async () => {
      const error = new Error('Not Found');
      (error as any).code = 'P2025';
      mockPerfilModel.delete.mockRejectedValue(error);

      await expect(repository.remove(99)).rejects.toThrow(
        'Perfil com ID 99 não encontrado.',
      );
    });

    it('deve relançar outros erros', async () => {
      const error = new Error('Database Error');
      mockPerfilModel.delete.mockRejectedValue(error);

      await expect(repository.remove(1)).rejects.toThrow('Database Error');
    });
  });

  describe('restore', () => {
    it('deve restaurar um perfil deletado', async () => {
      mockPerfilModel.update.mockResolvedValue(mockPerfil);

      const result = await repository.restore(1);

      expect(result.ativo).toBe(true);
      expect(result.deletedAt).toBeNull();
    });

    it('deve lançar erro customizado se perfil não encontrado (P2025)', async () => {
      const error = new Error('Not Found');
      (error as any).code = 'P2025';
      mockPerfilModel.update.mockRejectedValue(error);

      await expect(repository.restore(99)).rejects.toThrow(
        'Perfil com ID 99 não encontrado.',
      );
    });

    it('deve relançar outros erros', async () => {
      const error = new Error('Database Error');
      mockPerfilModel.update.mockRejectedValue(error);

      await expect(repository.restore(1)).rejects.toThrow('Database Error');
    });
  });

  describe('mapping', () => {
    it('deve mapear perfil sem permissões', async () => {
      mockPerfilModel.findFirst.mockResolvedValue({
        ...mockPerfil,
        permissoes: undefined,
      });

      const result = await repository.findOne(1);
      expect(result?.permissoes).toBeUndefined();
    });
  });

  describe('findByNome', () => {
    it('deve buscar por nome exato', async () => {
      mockPerfilModel.findFirst.mockResolvedValue(mockPerfil);

      const result = await repository.findByNome('Admin', false, 'empresa-1');

      expect(result?.nome).toBe('Admin');
      expect(mockPerfilModel.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            nome: 'Admin',
            empresaId: 'empresa-1',
          }),
        }),
      );
    });

    it('deve buscar por nome incluindo deletados', async () => {
      mockPerfilModel.findFirst.mockResolvedValue(mockPerfil);
      const result = await repository.findByNome('Admin', true);
      expect(result).toBeDefined();
    });
  });

  describe('findByNomeContaining', () => {
    it('deve buscar por parte do nome', async () => {
      mockPerfilModel.findMany.mockResolvedValue([mockPerfil]);
      mockPerfilModel.count.mockResolvedValue(1);

      const [result, total] = await repository.findByNomeContaining(
        'Adm',
        0,
        10,
      );

      expect(result).toHaveLength(1);
      expect(total).toBe(1);
      expect(mockPerfilModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            nome: expect.objectContaining({ contains: 'Adm' }),
          }),
        }),
      );
    });
  });
});
