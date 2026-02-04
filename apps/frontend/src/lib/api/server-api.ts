'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.API_URL || 'http://localhost:3000';

interface ApiError {
  message: string;
  statusCode: number;
}

class ApiClientError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = cookies();
  return cookieStore.get('next-auth.session-token')?.value;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: { revalidate?: number; tags?: string[] };
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = await getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: options.cache,
      next: options.next,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiClientError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(
      'Network error occurred',
      0
    );
  }
}

// API endpoints predefinidos
export const api = {
  // Auth
  auth: {
    login: (credentials: { email: string; senha: string }) =>
      apiClient('/auth/login', { method: 'POST', body: credentials }),
    refresh: (refreshToken: string) =>
      apiClient('/auth/refresh', { method: 'POST', body: { refresh_token: refreshToken } }),
    me: () =>
      apiClient('/auth/me'),
  },

  // Usuários
  usuarios: {
    list: (params?: { page?: number; limit?: number }) =>
      apiClient(`/usuarios?page=${params?.page || 1}&limit=${params?.limit || 10}`),
    get: (id: string) =>
      apiClient(`/usuarios/${id}`),
    create: (data: { email: string; senha: string }) =>
      apiClient('/usuarios', { method: 'POST', body: data }),
    update: (id: string, data: Partial<{ email: string; senha: string; ativo: boolean }>) =>
      apiClient(`/usuarios/${id}`, { method: 'PATCH', body: data }),
    delete: (id: string) =>
      apiClient(`/usuarios/${id}`, { method: 'DELETE' }),
    getEmpresas: (id: string) =>
      apiClient(`/usuarios/${id}/empresas`),
  },

  // Empresas
  empresas: {
    list: (params?: { page?: number; limit?: number }) =>
      apiClient(`/empresas?page=${params?.page || 1}&limit=${params?.limit || 10}`),
    get: (id: string) =>
      apiClient(`/empresas/${id}`),
    create: (data: { nome: string; descricao?: string; responsavelId: number }) =>
      apiClient('/empresas', { method: 'POST', body: data }),
    update: (id: string, data: Partial<{ nome: string; descricao: string; ativo: boolean }>) =>
      apiClient(`/empresas/${id}`, { method: 'PATCH', body: data }),
    delete: (id: string) =>
      apiClient(`/empresas/${id}`, { method: 'DELETE' }),
    addUsuario: (id: string, data: { usuarioId: number; perfilIds: number[] }) =>
      apiClient(`/empresas/${id}/usuarios`, { method: 'POST', body: data }),
    getUsuarios: (id: string) =>
      apiClient(`/empresas/${id}/usuarios`),
  },

  // Perfis
  perfis: {
    list: (params?: { page?: number; limit?: number }) =>
      apiClient(`/perfis?page=${params?.page || 1}&limit=${params?.limit || 10}`),
    get: (id: string) =>
      apiClient(`/perfis/${id}`),
    create: (data: { nome: string; codigo: string; descricao: string; empresaId: string; permissoesIds?: number[] }) =>
      apiClient('/perfis', { method: 'POST', body: data }),
    update: (id: string, data: Partial<{ nome: string; codigo: string; descricao: string; ativo: boolean }>) =>
      apiClient(`/perfis/${id}`, { method: 'PATCH', body: data }),
    delete: (id: string) =>
      apiClient(`/perfis/${id}`, { method: 'DELETE' }),
  },

  // Permissões
  permissoes: {
    list: (params?: { page?: number; limit?: number }) =>
      apiClient(`/permissoes?page=${params?.page || 1}&limit=${params?.limit || 10}`, {
        next: { revalidate: 60, tags: ['permissoes'] }
      }),
    get: (id: string) =>
      apiClient(`/permissoes/${id}`),
    create: (data: { nome: string; codigo: string; descricao: string }) =>
      apiClient('/permissoes', { method: 'POST', body: data }),
    update: (id: string, data: Partial<{ nome: string; codigo: string; descricao: string; ativo: boolean }>) =>
      apiClient(`/permissoes/${id}`, { method: 'PATCH', body: data }),
    delete: (id: string) =>
      apiClient(`/permissoes/${id}`, { method: 'DELETE' }),
  },
};
