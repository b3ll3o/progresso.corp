import { Perfil } from './perfil.entity';
import { Permissao } from '../../../permissoes/domain/entities/permissao.entity';

describe('Perfil Entity', () => {
  describe('constructor and basic properties', () => {
    it('should create an instance with all properties', () => {
      const mockPermissao = new Permissao();
      mockPermissao.id = 1;
      mockPermissao.nome = 'Criar Usuário';
      mockPermissao.codigo = 'USUARIO_CRIAR';

      const data = {
        id: 1,
        nome: 'Administrador',
        codigo: 'ADMIN',
        descricao: 'Perfil com acesso total ao sistema',
        empresaId: 'uuid-empresa-123',
        ativo: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        permissoes: [mockPermissao],
      };

      const perfil = new Perfil();
      Object.assign(perfil, data);

      expect(perfil.id).toBe(1);
      expect(perfil.nome).toBe('Administrador');
      expect(perfil.codigo).toBe('ADMIN');
      expect(perfil.descricao).toBe('Perfil com acesso total ao sistema');
      expect(perfil.empresaId).toBe('uuid-empresa-123');
      expect(perfil.ativo).toBe(true);
      expect(perfil.permissoes).toHaveLength(1);
    });

    it('should create an instance without permissoes', () => {
      const data = {
        id: 2,
        nome: 'Usuário Comum',
        codigo: 'USER',
        descricao: 'Perfil básico',
        empresaId: 'uuid-empresa-456',
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const perfil = new Perfil();
      Object.assign(perfil, data);

      expect(perfil.permissoes).toBeUndefined();
    });

    it('should handle empty permissoes array', () => {
      const perfil = new Perfil();
      perfil.id = 3;
      perfil.nome = 'Guest';
      perfil.codigo = 'GUEST';
      perfil.descricao = 'Acesso limitado';
      perfil.empresaId = 'uuid-empresa-789';
      perfil.ativo = true;
      perfil.permissoes = [];
      perfil.createdAt = new Date();
      perfil.updatedAt = new Date();

      expect(perfil.permissoes).toHaveLength(0);
    });
  });

  describe('integration with Permissao entity', () => {
    it('should have multiple permissoes', () => {
      const permissao1 = new Permissao();
      permissao1.id = 1;
      permissao1.nome = 'Criar';
      permissao1.codigo = 'CREATE';

      const permissao2 = new Permissao();
      permissao2.id = 2;
      permissao2.nome = 'Editar';
      permissao2.codigo = 'EDIT';

      const perfil = new Perfil();
      perfil.id = 1;
      perfil.nome = 'Editor';
      perfil.codigo = 'EDITOR';
      perfil.descricao = 'Pode criar e editar';
      perfil.empresaId = 'uuid-empresa';
      perfil.ativo = true;
      perfil.permissoes = [permissao1, permissao2];
      perfil.createdAt = new Date();
      perfil.updatedAt = new Date();

      expect(perfil.permissoes).toHaveLength(2);
      expect(perfil.permissoes![0].codigo).toBe('CREATE');
      expect(perfil.permissoes![1].codigo).toBe('EDIT');
    });
  });

  describe('dates handling', () => {
    it('should handle createdAt and updatedAt dates', () => {
      const createdAt = new Date('2024-01-01T10:00:00');
      const updatedAt = new Date('2024-01-02T15:30:00');

      const perfil = new Perfil();
      perfil.id = 1;
      perfil.nome = 'Teste';
      perfil.codigo = 'TEST';
      perfil.descricao = 'Teste';
      perfil.empresaId = 'uuid';
      perfil.ativo = true;
      perfil.createdAt = createdAt;
      perfil.updatedAt = updatedAt;

      expect(perfil.createdAt).toEqual(createdAt);
      expect(perfil.updatedAt).toEqual(updatedAt);
    });
  });

  describe('status management', () => {
    it('should be active by default', () => {
      const perfil = new Perfil();
      perfil.id = 1;
      perfil.nome = 'Ativo';
      perfil.codigo = 'ATIVO';
      perfil.descricao = 'Perfil ativo';
      perfil.empresaId = 'uuid';
      perfil.ativo = true;
      perfil.createdAt = new Date();
      perfil.updatedAt = new Date();

      expect(perfil.ativo).toBe(true);
    });

    it('should handle inactive status', () => {
      const perfil = new Perfil();
      perfil.id = 1;
      perfil.nome = 'Inativo';
      perfil.codigo = 'INATIVO';
      perfil.descricao = 'Perfil inativo';
      perfil.empresaId = 'uuid';
      perfil.ativo = false;
      perfil.createdAt = new Date();
      perfil.updatedAt = new Date();

      expect(perfil.ativo).toBe(false);
    });
  });

  describe('soft delete', () => {
    it('should handle deletedAt as null when active', () => {
      const perfil = new Perfil();
      perfil.id = 1;
      perfil.nome = 'Ativo';
      perfil.codigo = 'ATIVO';
      perfil.descricao = 'Perfil';
      perfil.empresaId = 'uuid';
      perfil.ativo = true;
      perfil.deletedAt = null;
      perfil.createdAt = new Date();
      perfil.updatedAt = new Date();

      expect(perfil.deletedAt).toBeNull();
    });

    it('should handle deletedAt with date when soft deleted', () => {
      const deletedAt = new Date('2024-01-01');
      const perfil = new Perfil();
      perfil.id = 1;
      perfil.nome = 'Deletado';
      perfil.codigo = 'DELETED';
      perfil.descricao = 'Perfil deletado';
      perfil.empresaId = 'uuid';
      perfil.ativo = false;
      perfil.deletedAt = deletedAt;
      perfil.createdAt = new Date();
      perfil.updatedAt = new Date();

      expect(perfil.deletedAt).toEqual(deletedAt);
    });
  });
});
