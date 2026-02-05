import axios, { AxiosInstance } from 'axios';

export class ApiClient {
  private static instance: AxiosInstance;

  static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: process.env.API_URL || 'http://localhost:3000',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Interceptor para log de requests (útil em debug)
      this.instance.interceptors.request.use(
        (config) => {
          if (process.env.DEBUG_E2E) {
            console.log(`[E2E] ${config.method?.toUpperCase()} ${config.url}`);
          }
          return config;
        },
        (error) => Promise.reject(error),
      );
    }

    return this.instance;
  }

  static setAuthToken(token: string) {
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  static clearAuthToken() {
    delete this.instance.defaults.headers.common['Authorization'];
  }
}

export const apiClient = ApiClient.getInstance();
