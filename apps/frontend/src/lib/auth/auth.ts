import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

const credentialsSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(8),
});

const API_URL = process.env.API_URL || 'http://localhost:3000';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        senha: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsed.data),
          });

          if (!response.ok) return null;

          const data = await response.json();

          // Busca informações do usuário
          const userResponse = await fetch(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${data.access_token}`,
            },
          });

          if (!userResponse.ok) return null;

          const user = await userResponse.json();

          return {
            id: user.id,
            email: user.email,
            name: user.nome,
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            empresas: user.empresas || [],
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.access_token = user.access_token;
        token.refresh_token = user.refresh_token;
        token.empresas = user.empresas;
      }

      // Atualização manual do token
      if (trigger === 'update' && session?.access_token) {
        token.access_token = session.access_token;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.access_token = token.access_token as string;
        session.refresh_token = token.refresh_token as string;
        session.empresas = token.empresas as any[];
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 15 * 60, // 15 minutos
  },
});
