import axios from 'axios';
import TestDataFactory from '../../support/test-data.factory';
import { AuthFixture } from '../../fixtures/auth.fixture';

describe('E2E: Empresas', () => {
  const API_URL = process.env.API_URL || 'http://localhost:3000';
  let authToken: string;
  let userId: number;

  beforeAll(async () => {
    await TestDataFactory.cleanup();
    const auth = await AuthFixture.createAuthenticatedUser();
    authToken = auth.accessToken;
    userId = auth.user.id;
  });

  afterAll(async () => {
    await TestDataFactory.cleanup();
  });

  describe('CRUD de Empresas', () => {
    it('deve criar uma nova empresa', async () => {
      const empresaData = {
        nome: 'Empresa E2E Test',
        cnpj: '12345678901234',
        responsavelId: userId,
      };

      const response = await axios.post(`${API_URL}/empresas`, empresaData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(201);
      expect(response.data.nome).toBe(empresaData.nome);
    });

    it('deve listar empresas com paginação', async () => {
      const response = await axios.get(`${API_URL}/empresas?page=1&limit=10`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('data');
    });

    it('deve associar usuário a empresa', async () => {
      const user = await TestDataFactory.createUser();
      const empresa = await TestDataFactory.createEmpresa({
        responsavelId: userId,
      });

      const response = await axios.post(
        `${API_URL}/empresas/${empresa.id}/usuarios`,
        { usuarioId: user.id, perfilIds: [] },
        { headers: { Authorization: `Bearer ${authToken}` } },
      );

      expect(response.status).toBe(201);
    });
  });
});
