import { Test, TestingModule } from '@nestjs/testing';
import { PrismaUsuarioRepositoryWithEvents } from './prisma-usuario-with-events.repository';
import { PrismaService } from '../../../prisma/prisma.service';
import { DomainEventPublisher } from '../../../shared/infrastructure/services/domain-event-publisher.service';
import { Usuario } from '../../domain/entities/usuario.entity';
import {
  UsuarioCreatedEvent,
  UsuarioUpdatedEvent,
  UsuarioSoftDeletedEvent,
  UsuarioRestoredEvent,
} from '../../domain/events/usuario.events';

describe('PrismaUsuarioRepositoryWithEvents', () => {
  let repository: PrismaUsuarioRepositoryWithEvents;
  let eventPublisher: jest.Mocked<DomainEventPublisher>;

  const mockUsuarioModel = {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    delete: jest.fn(),
  };

  const mockPrismaService = {
    usuario: mockUsuarioModel,
    extended: {
      usuario: mockUsuarioModel,
    },
  };

  const mockPrismaUser = {
    id: 1,
    email: 'test@test.com',
    senha: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ativo: true,
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaUsuarioRepositoryWithEvents,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: DomainEventPublisher,
          useValue: {
            publish: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    repository = module.get<PrismaUsuarioRepositoryWithEvents>(
      PrismaUsuarioRepositoryWithEvents,
    );
    eventPublisher = module.get(DomainEventPublisher);
  });

  describe('create', () => {
    it('deve criar um novo usuário e disparar evento', async () => {
      const createData: Partial<Usuario> = {
        email: 'test@example.com',
        senha: 'password',
      };
      mockUsuarioModel.create.mockResolvedValue(mockPrismaUser);

      const result = await repository.create(createData);

      expect(result).toBeInstanceOf(Usuario);
      expect(eventPublisher.publish).toHaveBeenCalledWith(
        expect.any(UsuarioCreatedEvent),
      );
    });
  });

  describe('update', () => {
    it('deve atualizar usuário e disparar evento', async () => {
      mockUsuarioModel.findUnique.mockResolvedValue(mockPrismaUser);
      mockUsuarioModel.update.mockResolvedValue({
        ...mockPrismaUser,
        email: 'new@test.com',
      });

      await repository.update(1, { email: 'new@test.com' });

      expect(eventPublisher.publish).toHaveBeenCalledWith(
        expect.any(UsuarioUpdatedEvent),
      );
    });

    it('não deve incluir alterações se os valores forem iguais', async () => {
      mockUsuarioModel.findUnique.mockResolvedValue(mockPrismaUser);
      mockUsuarioModel.update.mockResolvedValue(mockPrismaUser);

      await repository.update(1, { email: 'test@test.com', ativo: true });

      expect(eventPublisher.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          changes: {},
        }),
      );
    });
  });

  describe('remove', () => {
    it('deve remover (soft-delete) usuário e disparar evento', async () => {
      mockUsuarioModel.findUnique.mockResolvedValue(mockPrismaUser);
      mockUsuarioModel.delete.mockResolvedValue(mockPrismaUser);

      await repository.remove(1);

      expect(eventPublisher.publish).toHaveBeenCalledWith(
        expect.any(UsuarioSoftDeletedEvent),
      );
    });

    it('deve lançar erro P2025 se ID não existir', async () => {
      const error = new Error('Record not found');
      (error as any).code = 'P2025';
      mockUsuarioModel.findUnique.mockResolvedValue(mockPrismaUser);
      mockUsuarioModel.delete.mockRejectedValue(error);

      await expect(repository.remove(999)).rejects.toThrow(
        'Usuário com ID 999 não encontrado.',
      );
    });
    it('deve lançar erro genérico se ocorrer falha na remoção', async () => {
      const error = new Error('Database connection failed');
      mockUsuarioModel.findUnique.mockResolvedValue(mockPrismaUser);
      mockUsuarioModel.delete.mockRejectedValue(error);

      await expect(repository.remove(1)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('restore', () => {
    it('deve restaurar usuário e disparar evento', async () => {
      mockUsuarioModel.update.mockResolvedValue(mockPrismaUser);

      await repository.restore(1);

      expect(eventPublisher.publish).toHaveBeenCalledWith(
        expect.any(UsuarioRestoredEvent),
      );
    });

    it('deve lançar erro P2025 se ID não existir', async () => {
      const error = new Error('Record not found');
      (error as any).code = 'P2025';
      mockUsuarioModel.update.mockRejectedValue(error);

      await expect(repository.restore(999)).rejects.toThrow(
        'Usuário com ID 999 não encontrado.',
      );
    });
    it('deve lançar erro genérico se ocorrer falha na restauração', async () => {
      const error = new Error('Database connection failed');
      mockUsuarioModel.update.mockRejectedValue(error);

      await expect(repository.restore(1)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('mapToEntity', () => {
    it('deve retornar null se input for null/undefined', async () => {
      // acessando método privado via casting para any
      const result = (repository as any).mapToEntity(null);
      expect(result).toBeNull();
    });

    it('deve mapear usuário sem empresas', async () => {
      mockUsuarioModel.findUnique.mockResolvedValue({
        ...mockPrismaUser,
        empresas: undefined,
      });
      const result = await repository.findOne(1);
      expect(result?.empresas).toEqual([]);
    });

    it('deve mapear usuário com empresas mas sem perfis', async () => {
      mockUsuarioModel.findUnique.mockResolvedValue({
        ...mockPrismaUser,
        empresas: [
          {
            id: 1,
            usuarioId: 1,
            empresaId: 'uuid',
            createdAt: new Date(),
            updatedAt: new Date(),
            perfis: undefined,
          },
        ],
      });
      const result = await repository.findOne(1);
      expect(result).toBeDefined();
      expect(result!.empresas).toBeDefined();
      expect(result!.empresas![0].perfis).toEqual([]);
    });
  });

  describe('findOne and findAll', () => {
    it('deve encontrar um usuário', async () => {
      mockUsuarioModel.findUnique.mockResolvedValue(mockPrismaUser);
      const res = await repository.findOne(1);
      expect(res?.id).toBe(1);
    });

    it('deve retornar todos os usuários', async () => {
      mockUsuarioModel.findMany.mockResolvedValue([mockPrismaUser]);
      mockUsuarioModel.count.mockResolvedValue(1);
      const res = await repository.findAll({ page: 1, limit: 10 });
      expect(res.data).toHaveLength(1);
    });
  });

  describe('findByEmail', () => {
    it('deve encontrar por email', async () => {
      mockUsuarioModel.findUnique.mockResolvedValue(mockPrismaUser);
      const res = await repository.findByEmail('test@test.com');
      expect(res?.email).toBe('test@test.com');
    });

    it('deve carregar com perfis e permissões', async () => {
      mockUsuarioModel.findUnique.mockResolvedValue(mockPrismaUser);
      const res =
        await repository.findByEmailWithPerfisAndPermissoes('test@test.com');
      expect(res).toBeDefined();
    });
  });
});
