import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TestDataFactory {
  private static counter = 0;

  private static getUniqueId(): number {
    return Date.now() + ++this.counter;
  }

  static async createUser(
    overrides: Partial<{
      email: string;
      senha: string;
      nome: string;
      ativo: boolean;
    }> = {},
  ) {
    const uniqueId = this.getUniqueId();
    const userData = {
      email: overrides.email || `test-${uniqueId}@e2e.com`,
      senha: overrides.senha || 'Test123!@#',
      nome: overrides.nome || `Usuário E2E ${uniqueId}`,
      ativo: overrides.ativo !== undefined ? overrides.ativo : true,
    };

    const user = await prisma.usuario.create({
      data: userData,
    });

    return {
      ...user,
      senha: userData.senha,
    };
  }

  static async createEmpresa(
    overrides: Partial<{
      nome: string;
      cnpj: string;
      descricao: string;
      responsavelId: number;
      ativo: boolean;
    }> = {},
  ) {
    const uniqueId = this.getUniqueId();
    const empresaData: any = {
      nome: overrides.nome || `Empresa E2E ${uniqueId}`,
      cnpj: overrides.cnpj || this.generateCNPJ(),
      descricao: overrides.descricao || 'Descrição da empresa E2E',
      ativo: overrides.ativo !== undefined ? overrides.ativo : true,
    };

    if (overrides.responsavelId !== undefined) {
      empresaData.responsavelId = overrides.responsavelId;
    }

    return await prisma.empresa.create({
      data: empresaData,
    });
  }

  static async createPerfil(
    overrides: Partial<{
      nome: string;
      codigo: string;
      descricao: string;
      empresaId: string;
      ativo: boolean;
    }> = {},
  ) {
    const uniqueId = this.getUniqueId();
    const perfilData: any = {
      nome: overrides.nome || `Perfil E2E ${uniqueId}`,
      codigo: overrides.codigo || `PERFIL_${uniqueId}`,
      descricao: overrides.descricao || 'Descrição do perfil E2E',
      ativo: overrides.ativo !== undefined ? overrides.ativo : true,
    };

    if (overrides.empresaId !== undefined) {
      perfilData.empresaId = overrides.empresaId;
    }

    return await prisma.perfil.create({
      data: perfilData,
    });
  }

  static async createPermissao(
    overrides: Partial<{
      nome: string;
      codigo: string;
      descricao: string;
      ativo: boolean;
    }> = {},
  ) {
    const uniqueId = this.getUniqueId();
    const permissaoData = {
      nome: overrides.nome || `Permissão E2E ${uniqueId}`,
      codigo: overrides.codigo || `PERM_${uniqueId}`,
      descricao: overrides.descricao || 'Descrição da permissão E2E',
      ativo: overrides.ativo !== undefined ? overrides.ativo : true,
    };

    return await prisma.permissao.create({
      data: permissaoData,
    });
  }

  static async createUsuarioEmpresa(data: {
    usuarioId: number;
    empresaId: string;
    perfilIds?: number[];
  }) {
    return await prisma.usuarioEmpresa.create({
      data: {
        usuarioId: data.usuarioId,
        empresaId: data.empresaId,
        ...(data.perfilIds && {
          perfis: {
            connect: data.perfilIds.map((id) => ({ id })),
          },
        }),
      },
    });
  }

  static async cleanup() {
    // Limpar dados de teste em ordem reversa para respeitar FKs
    await prisma.usuarioEmpresa.deleteMany({
      where: {
        usuario: {
          email: {
            contains: '@e2e.com',
          },
        },
      },
    });

    await prisma.perfil.deleteMany({
      where: {
        codigo: {
          contains: 'PERFIL_',
        },
      },
    });

    await prisma.permissao.deleteMany({
      where: {
        codigo: {
          contains: 'PERM_',
        },
      },
    });

    await prisma.empresa.deleteMany({
      where: {
        nome: {
          contains: 'Empresa E2E',
        },
      },
    });

    await prisma.usuario.deleteMany({
      where: {
        email: {
          contains: '@e2e.com',
        },
      },
    });
  }

  private static generateCNPJ(): string {
    const digits = Array.from({ length: 14 }, () =>
      Math.floor(Math.random() * 10),
    );
    return digits.join('');
  }
}

export default TestDataFactory;
