import { Permissao } from './permissao.entity';

describe('Permissao Entity', () => {
  describe('constructor and basic properties', () => {
    it('should create an instance with all properties', () => {
      const permissao = new Permissao();
      permissao.id = 1;
      permissao.nome = 'Criar Usuários';
      permissao.codigo = 'USUARIO_CRIAR';
      permissao.descricao = 'Permite criar novos usuários no sistema';
      permissao.ativo = true;
      permissao.createdAt = new Date('2024-01-01');
      permissao.updatedAt = new Date('2024-01-01');

      expect(permissao.id).toBe(1);
      expect(permissao.nome).toBe('Criar Usuários');
      expect(permissao.codigo).toBe('USUARIO_CRIAR');
      expect(permissao.descricao).toBe(
        'Permite criar novos usuários no sistema',
      );
      expect(permissao.ativo).toBe(true);
    });

    it('should create an instance with minimal properties', () => {
      const permissao = new Permissao();
      permissao.id = 2;
      permissao.nome = 'Ler';
      permissao.codigo = 'READ';
      permissao.descricao = 'Permissão de leitura';
      permissao.ativo = true;
      permissao.createdAt = new Date();
      permissao.updatedAt = new Date();

      expect(permissao.id).toBe(2);
      expect(permissao.nome).toBe('Ler');
    });
  });

  describe('code standards', () => {
    it('should accept uppercase codes', () => {
      const permissao = new Permissao();
      permissao.id = 1;
      permissao.nome = 'Teste';
      permissao.codigo = 'UPPER_CASE_CODE';
      permissao.descricao = 'Teste';
      permissao.ativo = true;
      permissao.createdAt = new Date();
      permissao.updatedAt = new Date();

      expect(permissao.codigo).toBe('UPPER_CASE_CODE');
    });

    it('should accept codes with colon separator', () => {
      const permissao = new Permissao();
      permissao.id = 1;
      permissao.nome = 'Teste';
      permissao.codigo = 'users:create';
      permissao.descricao = 'Teste';
      permissao.ativo = true;
      permissao.createdAt = new Date();
      permissao.updatedAt = new Date();

      expect(permissao.codigo).toBe('users:create');
    });
  });

  describe('status management', () => {
    it('should be active by default', () => {
      const permissao = new Permissao();
      permissao.id = 1;
      permissao.nome = 'Permissão Ativa';
      permissao.codigo = 'ATIVA';
      permissao.descricao = 'Permissão';
      permissao.ativo = true;
      permissao.createdAt = new Date();
      permissao.updatedAt = new Date();

      expect(permissao.ativo).toBe(true);
    });

    it('should handle inactive status', () => {
      const permissao = new Permissao();
      permissao.id = 1;
      permissao.nome = 'Permissão Inativa';
      permissao.codigo = 'INATIVA';
      permissao.descricao = 'Permissão';
      permissao.ativo = false;
      permissao.createdAt = new Date();
      permissao.updatedAt = new Date();

      expect(permissao.ativo).toBe(false);
    });
  });

  describe('timestamps', () => {
    it('should track creation and update dates', () => {
      const createdAt = new Date('2024-01-01T10:00:00');
      const updatedAt = new Date('2024-06-15T14:30:00');

      const permissao = new Permissao();
      permissao.id = 1;
      permissao.nome = 'Teste';
      permissao.codigo = 'TEST';
      permissao.descricao = 'Teste';
      permissao.ativo = true;
      permissao.createdAt = createdAt;
      permissao.updatedAt = updatedAt;

      expect(permissao.createdAt).toEqual(createdAt);
      expect(permissao.updatedAt).toEqual(updatedAt);
    });
  });

  describe('soft delete', () => {
    it('should support soft delete with deletedAt', () => {
      const deletedAt = new Date('2024-12-01');

      const permissao = new Permissao();
      permissao.id = 1;
      permissao.nome = 'Permissão Deletada';
      permissao.codigo = 'DELETED';
      permissao.descricao = 'Permissão removida';
      permissao.ativo = false;
      permissao.deletedAt = deletedAt;
      permissao.createdAt = new Date();
      permissao.updatedAt = new Date();

      expect(permissao.deletedAt).toEqual(deletedAt);
      expect(permissao.ativo).toBe(false);
    });

    it('should have deletedAt as undefined when not deleted', () => {
      const permissao = new Permissao();
      permissao.id = 1;
      permissao.nome = 'Permissão Ativa';
      permissao.codigo = 'ATIVA';
      permissao.descricao = 'Permissão normal';
      permissao.ativo = true;
      permissao.createdAt = new Date();
      permissao.updatedAt = new Date();

      expect(permissao.deletedAt).toBeUndefined();
    });
  });

  describe('common permissions', () => {
    it('should handle CRUD permissions', () => {
      const permissions = [
        { nome: 'Criar Usuário', codigo: 'USUARIO_CRIAR' },
        { nome: 'Ler Usuário', codigo: 'USUARIO_LER' },
        { nome: 'Atualizar Usuário', codigo: 'USUARIO_ATUALIZAR' },
        { nome: 'Deletar Usuário', codigo: 'USUARIO_DELETAR' },
      ];

      permissions.forEach((perm, index) => {
        const permissao = new Permissao();
        permissao.id = index + 1;
        permissao.nome = perm.nome;
        permissao.codigo = perm.codigo;
        permissao.descricao = `Permissão para ${perm.nome.toLowerCase()}`;
        permissao.ativo = true;
        permissao.createdAt = new Date();
        permissao.updatedAt = new Date();

        expect(permissao.codigo).toBe(perm.codigo);
        expect(permissao.nome).toBe(perm.nome);
      });
    });
  });
});
