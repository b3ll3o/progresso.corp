import { UsuarioEmpresa } from './usuario-empresa.entity';
import { Empresa } from '../../../empresas/domain/entities/empresa.entity';
import { Perfil } from '../../../perfis/domain/entities/perfil.entity';

describe('UsuarioEmpresa Entity', () => {
  describe('constructor', () => {
    it('should create an instance with partial data', () => {
      const data = {
        id: 1,
        usuarioId: 10,
        empresaId: 'empresa-uuid-123',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const usuarioEmpresa = new UsuarioEmpresa(data);

      expect(usuarioEmpresa.id).toBe(1);
      expect(usuarioEmpresa.usuarioId).toBe(10);
      expect(usuarioEmpresa.empresaId).toBe('empresa-uuid-123');
      expect(usuarioEmpresa.createdAt).toEqual(data.createdAt);
      expect(usuarioEmpresa.updatedAt).toEqual(data.updatedAt);
    });

    it('should create an instance with all properties including relations', () => {
      const empresa = new Empresa({
        id: 'empresa-uuid',
        nome: 'Empresa Teste',
        responsavelId: 1,
      });

      const perfil = new Perfil();
      perfil.id = 1;
      perfil.nome = 'Admin';
      perfil.codigo = 'ADMIN';
      perfil.descricao = 'Administrador';
      perfil.empresaId = 'empresa-uuid';
      perfil.ativo = true;
      perfil.createdAt = new Date();
      perfil.updatedAt = new Date();

      const data = {
        id: 1,
        usuarioId: 10,
        empresaId: 'empresa-uuid',
        empresa: empresa,
        perfis: [perfil],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const usuarioEmpresa = new UsuarioEmpresa(data);

      expect(usuarioEmpresa.empresa).toBeDefined();
      expect(usuarioEmpresa.empresa!.nome).toBe('Empresa Teste');
      expect(usuarioEmpresa.perfis).toHaveLength(1);
      expect(usuarioEmpresa.perfis![0].nome).toBe('Admin');
    });

    it('should handle empty object', () => {
      const usuarioEmpresa = new UsuarioEmpresa({});

      expect(usuarioEmpresa).toBeDefined();
      expect(usuarioEmpresa.id).toBeUndefined();
      expect(usuarioEmpresa.usuarioId).toBeUndefined();
      expect(usuarioEmpresa.empresaId).toBeUndefined();
    });

    it('should handle optional empresa relation', () => {
      const data = {
        id: 1,
        usuarioId: 10,
        empresaId: 'empresa-uuid',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const usuarioEmpresa = new UsuarioEmpresa(data);

      expect(usuarioEmpresa.empresa).toBeUndefined();
      expect(usuarioEmpresa.perfis).toBeUndefined();
    });

    it('should handle empty perfis array', () => {
      const data = {
        id: 1,
        usuarioId: 10,
        empresaId: 'empresa-uuid',
        perfis: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const usuarioEmpresa = new UsuarioEmpresa(data);

      expect(usuarioEmpresa.perfis).toHaveLength(0);
    });
  });

  describe('relationships', () => {
    it('should have multiple perfis', () => {
      const perfis = [
        createMockPerfil(1, 'Admin', 'ADMIN'),
        createMockPerfil(2, 'User', 'USER'),
        createMockPerfil(3, 'Guest', 'GUEST'),
      ];

      const usuarioEmpresa = new UsuarioEmpresa({
        id: 1,
        usuarioId: 10,
        empresaId: 'empresa-uuid',
        perfis: perfis,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(usuarioEmpresa.perfis).toHaveLength(3);
    });

    it('should have empresa with all properties', () => {
      const empresa = new Empresa({
        id: 'empresa-uuid-123',
        nome: 'Minha Empresa',
        descricao: 'Descrição da empresa',
        responsavelId: 5,
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const usuarioEmpresa = new UsuarioEmpresa({
        id: 1,
        usuarioId: 10,
        empresaId: 'empresa-uuid-123',
        empresa: empresa,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(usuarioEmpresa.empresa!.id).toBe('empresa-uuid-123');
      expect(usuarioEmpresa.empresa!.nome).toBe('Minha Empresa');
      expect(usuarioEmpresa.empresa!.responsavelId).toBe(5);
    });
  });

  describe('timestamps', () => {
    it('should track creation and update dates', () => {
      const createdAt = new Date('2024-01-01T10:00:00');
      const updatedAt = new Date('2024-06-15T14:30:00');

      const usuarioEmpresa = new UsuarioEmpresa({
        id: 1,
        usuarioId: 10,
        empresaId: 'empresa-uuid',
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      expect(usuarioEmpresa.createdAt).toEqual(createdAt);
      expect(usuarioEmpresa.updatedAt).toEqual(updatedAt);
    });
  });

  describe('business rules', () => {
    it('should require both usuarioId and empresaId', () => {
      const usuarioEmpresa = new UsuarioEmpresa({
        id: 1,
        usuarioId: 10,
        empresaId: 'empresa-uuid',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(usuarioEmpresa.usuarioId).toBeDefined();
      expect(usuarioEmpresa.empresaId).toBeDefined();
    });

    it('should support multiple users in same empresa', () => {
      const empresaId = 'empresa-uuid';

      const user1 = new UsuarioEmpresa({
        id: 1,
        usuarioId: 10,
        empresaId: empresaId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const user2 = new UsuarioEmpresa({
        id: 2,
        usuarioId: 11,
        empresaId: empresaId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(user1.empresaId).toBe(empresaId);
      expect(user2.empresaId).toBe(empresaId);
      expect(user1.usuarioId).not.toBe(user2.usuarioId);
    });
  });
});

function createMockPerfil(id: number, nome: string, codigo: string): Perfil {
  const perfil = new Perfil();
  perfil.id = id;
  perfil.nome = nome;
  perfil.codigo = codigo;
  perfil.descricao = `Perfil ${nome}`;
  perfil.empresaId = 'empresa-uuid';
  perfil.ativo = true;
  perfil.createdAt = new Date();
  perfil.updatedAt = new Date();
  return perfil;
}
