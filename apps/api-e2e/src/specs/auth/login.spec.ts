import axios from 'axios';
import TestDataFactory from '../../support/test-data.factory';

describe('E2E: Fluxo de Autenticação', () => {
  const API_URL = process.env.API_URL || 'http://localhost:3000';

  beforeAll(async () => {
    // Limpar dados de teste anteriores
    await TestDataFactory.cleanup();
  });

  afterAll(async () => {
    // Limpar dados de teste
    await TestDataFactory.cleanup();
  });

  describe('POST /auth/login', () => {
    it('deve autenticar usuário com credenciais válidas', async () => {
      // Arrange
      const user = await TestDataFactory.createUser({
        email: 'login-test@e2e.com',
        senha: 'Test123!@#',
      });

      // Act
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: user.email,
        senha: user.senha,
      });

      // Assert
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('accessToken');
      expect(response.data).toHaveProperty('refreshToken');
      expect(response.data).toHaveProperty('usuario');
      expect(response.data.usuario.email).toBe(user.email);
    });

    it('deve retornar 401 quando credenciais são inválidas', async () => {
      // Arrange
      const user = await TestDataFactory.createUser({
        email: 'invalid-test@e2e.com',
        senha: 'Test123!@#',
      });

      // Act & Assert
      try {
        await axios.post(`${API_URL}/auth/login`, {
          email: user.email,
          senha: 'senha-errada',
        });
        fail('Deveria ter lançado erro');
      } catch (error: any) {
        expect(error.response.status).toBe(401);
      }
    });

    it('deve retornar 401 quando usuário não existe', async () => {
      // Act & Assert
      try {
        await axios.post(`${API_URL}/auth/login`, {
          email: 'naoexiste@e2e.com',
          senha: 'qualquer-senha',
        });
        fail('Deveria ter lançado erro');
      } catch (error: any) {
        expect(error.response.status).toBe(401);
      }
    });

    it('deve retornar 400 quando email não é fornecido', async () => {
      // Act & Assert
      try {
        await axios.post(`${API_URL}/auth/login`, {
          senha: 'Test123!@#',
        });
        fail('Deveria ter lançado erro');
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });

    it('deve retornar 400 quando senha não é fornecida', async () => {
      // Act & Assert
      try {
        await axios.post(`${API_URL}/auth/login`, {
          email: 'test@e2e.com',
        });
        fail('Deveria ter lançado erro');
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });
  });

  describe('POST /auth/refresh', () => {
    it('deve renovar access token com refresh token válido', async () => {
      // Arrange
      const user = await TestDataFactory.createUser({
        email: 'refresh-test@e2e.com',
        senha: 'Test123!@#',
      });

      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: user.email,
        senha: user.senha,
      });

      const { refreshToken } = loginResponse.data;

      // Act
      const response = await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken,
      });

      // Assert
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('accessToken');
      expect(response.data).toHaveProperty('refreshToken');
      expect(response.data.accessToken).not.toBe(
        loginResponse.data.accessToken,
      );
    });

    it('deve retornar 401 quando refresh token é inválido', async () => {
      // Act & Assert
      try {
        await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken: 'token-invalido',
        });
        fail('Deveria ter lançado erro');
      } catch (error: any) {
        expect(error.response.status).toBe(401);
      }
    });

    it('deve retornar 400 quando refresh token não é fornecido', async () => {
      // Act & Assert
      try {
        await axios.post(`${API_URL}/auth/refresh`, {});
        fail('Deveria ter lançado erro');
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });
  });
});
