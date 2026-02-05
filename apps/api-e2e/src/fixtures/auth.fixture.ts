import axios from 'axios';
import TestDataFactory from '../support/test-data.factory';
import { ApiClient } from '../support/api-client';

export interface AuthContext {
  user: {
    id: number;
    email: string;
    senha: string;
  };
  accessToken: string;
  refreshToken: string;
}

export class AuthFixture {
  static async createAuthenticatedUser(): Promise<AuthContext> {
    // Criar usuário no banco
    const user = await TestDataFactory.createUser({
      email: `auth-${Date.now()}@e2e.com`,
      senha: 'Test123!@#',
    });

    // Fazer login via API
    const response = await axios.post(
      `${process.env.API_URL || 'http://localhost:3000'}/auth/login`,
      {
        email: user.email,
        senha: user.senha,
      },
    );

    const { accessToken, refreshToken } = response.data;

    return {
      user: {
        id: user.id,
        email: user.email,
        senha: user.senha,
      },
      accessToken,
      refreshToken,
    };
  }

  static async setupAuthContext(context: AuthContext) {
    ApiClient.setAuthToken(context.accessToken);
  }

  static async teardownAuthContext() {
    ApiClient.clearAuthToken();
  }
}
