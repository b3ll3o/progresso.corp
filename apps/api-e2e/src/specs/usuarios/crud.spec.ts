import axios from 'axios';
import TestDataFactory from '../../support/test-data.factory';
import { AuthFixture } from '../../fixtures/auth.fixture';
import { ApiClient } from '../../support/api-client';

describe('E2E: Usuários', () => {
  const API_URL = process.env.API_URL || 'http://localhost:3000';
  let authToken: string;

  beforeAll(async () => {
    await TestDataFactory.cleanup();
    const auth = await AuthFixture.createAuthenticatedUser();
    authToken = auth.accessToken;
    ApiClient.setAuthToken(authToken);
  });

  afterAll(async () => {
    await TestDataFactory.cleanup();
  });

  describe('CRUD de Usuários', () => {
    it('deve criar um novo usuário', async () => {
      const userData = {
        email: `create-test@e2e.com`,
        senha: 'Test123!@#',
      };

      const response = await axios.post(`${API_URL}/usuarios`, userData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(201);
      expect(response.data.email).toBe(userData.email);
    });

    it('deve listar usuários com paginação', async () => {
      await TestDataFactory.createUser({ email: 'list1@e2e.com' });
      await TestDataFactory.createUser({ email: 'list2@e2e.com' });

      const response = await axios.get(`${API_URL}/usuarios?page=1&limit=10`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('data');
      expect(response.data).toHaveProperty('total');
      expect(Array.isArray(response.data.data)).toBe(true);
    });

    it('deve buscar usuário por ID', async () => {
      const user = await TestDataFactory.createUser({ email: 'find@e2e.com' });

      const response = await axios.get(`${API_URL}/usuarios/${user.id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(200);
      expect(response.data.id).toBe(user.id);
    });

    it('deve atualizar usuário', async () => {
      const user = await TestDataFactory.createUser({
        email: 'update@e2e.com',
      });

      const response = await axios.patch(
        `${API_URL}/usuarios/${user.id}`,
        { ativo: false },
        { headers: { Authorization: `Bearer ${authToken}` } },
      );

      expect(response.status).toBe(200);
      expect(response.data.ativo).toBe(false);
    });

    it('deve remover usuário (soft delete)', async () => {
      const user = await TestDataFactory.createUser({
        email: 'delete@e2e.com',
      });

      const response = await axios.delete(`${API_URL}/usuarios/${user.id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(200);
    });
  });
});
