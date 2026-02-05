import {
  Empresa,
  CreateEmpresaData,
  UpdateEmpresaData,
} from './empresa.entity';

describe('Empresa Entity', () => {
  describe('constructor', () => {
    it('should create an instance with valid data', () => {
      const data = {
        id: 'uuid-123',
        nome: 'Empresa Teste',
        descricao: 'Descrição da empresa',
        responsavelId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const empresa = new Empresa(data);

      expect(empresa).toBeDefined();
      expect(empresa.id).toBe('uuid-123');
      expect(empresa.nome).toBe('Empresa Teste');
      expect(empresa.descricao).toBe('Descrição da empresa');
      expect(empresa.responsavelId).toBe(1);
    });

    it('should initialize with default ativo=true when not specified', () => {
      const data = {
        id: 'uuid-123',
        nome: 'Empresa Teste',
        responsavelId: 1,
      };

      const empresa = new Empresa(data);

      expect(empresa.ativo).toBe(true);
    });

    it('should respect ativo=false when specified', () => {
      const data = {
        id: 'uuid-123',
        nome: 'Empresa Teste',
        responsavelId: 1,
        ativo: false,
      };

      const empresa = new Empresa(data);

      expect(empresa.ativo).toBe(false);
    });

    it('should handle optional fields as null', () => {
      const data = {
        id: 'uuid-123',
        nome: 'Empresa Teste',
        responsavelId: 1,
        descricao: null,
        deletedAt: null,
      };

      const empresa = new Empresa(data);

      expect(empresa.descricao).toBeNull();
      expect(empresa.deletedAt).toBeNull();
    });
  });

  describe('desativar', () => {
    it('should set ativo to false and deletedAt to current date', () => {
      const empresa = new Empresa({
        id: 'uuid-123',
        nome: 'Empresa Teste',
        responsavelId: 1,
        ativo: true,
      });

      const beforeDesativar = new Date();
      empresa.desativar();
      const afterDesativar = new Date();

      expect(empresa.ativo).toBe(false);
      expect(empresa.deletedAt).toBeInstanceOf(Date);
      expect(empresa.deletedAt!.getTime()).toBeGreaterThanOrEqual(
        beforeDesativar.getTime(),
      );
      expect(empresa.deletedAt!.getTime()).toBeLessThanOrEqual(
        afterDesativar.getTime(),
      );
    });

    it('should update deletedAt even if already inactive', () => {
      const oldDeletedAt = new Date('2023-01-01');
      const empresa = new Empresa({
        id: 'uuid-123',
        nome: 'Empresa Teste',
        responsavelId: 1,
        ativo: false,
        deletedAt: oldDeletedAt,
      });

      empresa.desativar();

      expect(empresa.deletedAt).not.toEqual(oldDeletedAt);
      expect(empresa.deletedAt!.getTime()).toBeGreaterThan(
        oldDeletedAt.getTime(),
      );
    });
  });

  describe('ativar', () => {
    it('should set ativo to true and deletedAt to null', () => {
      const empresa = new Empresa({
        id: 'uuid-123',
        nome: 'Empresa Teste',
        responsavelId: 1,
        ativo: false,
        deletedAt: new Date(),
      });

      empresa.ativar();

      expect(empresa.ativo).toBe(true);
      expect(empresa.deletedAt).toBeNull();
    });

    it('should remain active if already active', () => {
      const empresa = new Empresa({
        id: 'uuid-123',
        nome: 'Empresa Teste',
        responsavelId: 1,
        ativo: true,
      });

      empresa.ativar();

      expect(empresa.ativo).toBe(true);
      expect(empresa.deletedAt).toBeNull();
    });
  });

  describe('validarParaCriacao', () => {
    it('should not throw error for valid empresa', () => {
      const empresa = new Empresa({
        id: 'uuid-123',
        nome: 'Empresa Válida',
        responsavelId: 1,
      });

      expect(() => empresa.validarParaCriacao()).not.toThrow();
    });

    it('should throw error when nome is missing', () => {
      const empresa = new Empresa({
        id: 'uuid-123',
        nome: '',
        responsavelId: 1,
      });

      expect(() => empresa.validarParaCriacao()).toThrow(
        'O nome da empresa deve ter pelo menos 3 caracteres.',
      );
    });

    it('should throw error when nome has less than 3 characters', () => {
      const empresa = new Empresa({
        id: 'uuid-123',
        nome: 'AB',
        responsavelId: 1,
      });

      expect(() => empresa.validarParaCriacao()).toThrow(
        'O nome da empresa deve ter pelo menos 3 caracteres.',
      );
    });

    it('should accept nome with exactly 3 characters', () => {
      const empresa = new Empresa({
        id: 'uuid-123',
        nome: 'ABC',
        responsavelId: 1,
      });

      expect(() => empresa.validarParaCriacao()).not.toThrow();
    });
  });
});

describe('CreateEmpresaData Interface', () => {
  it('should accept valid create data', () => {
    const data: CreateEmpresaData = {
      nome: 'Nova Empresa',
      descricao: 'Descrição opcional',
      responsavelId: 1,
    };

    expect(data.nome).toBe('Nova Empresa');
    expect(data.descricao).toBe('Descrição opcional');
    expect(data.responsavelId).toBe(1);
  });

  it('should accept data without optional descricao', () => {
    const data: CreateEmpresaData = {
      nome: 'Nova Empresa',
      responsavelId: 1,
    };

    expect(data.descricao).toBeUndefined();
  });

  it('should accept null descricao', () => {
    const data: CreateEmpresaData = {
      nome: 'Nova Empresa',
      descricao: null,
      responsavelId: 1,
    };

    expect(data.descricao).toBeNull();
  });
});

describe('UpdateEmpresaData Interface', () => {
  it('should accept partial update data', () => {
    const data: UpdateEmpresaData = {
      nome: 'Nome Atualizado',
    };

    expect(data.nome).toBe('Nome Atualizado');
    expect(data.descricao).toBeUndefined();
    expect(data.ativo).toBeUndefined();
  });

  it('should accept all optional fields', () => {
    const data: UpdateEmpresaData = {
      nome: 'Nome Atualizado',
      descricao: 'Nova descrição',
      ativo: false,
    };

    expect(data.nome).toBe('Nome Atualizado');
    expect(data.descricao).toBe('Nova descrição');
    expect(data.ativo).toBe(false);
  });

  it('should accept empty update data', () => {
    const data: UpdateEmpresaData = {};

    expect(Object.keys(data)).toHaveLength(0);
  });
});
