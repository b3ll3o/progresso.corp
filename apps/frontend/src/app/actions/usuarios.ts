'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { api } from '@/lib/api/server-api';

const createUsuarioSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
});

const updateUsuarioSchema = z.object({
  email: z.string().email('Email inválido').optional(),
  senha: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres').optional(),
  ativo: z.boolean().optional(),
});

type CreateUsuarioInput = z.infer<typeof createUsuarioSchema>;
type UpdateUsuarioInput = z.infer<typeof updateUsuarioSchema>;

export async function createUsuario(formData: FormData) {
  const rawData = {
    email: formData.get('email') as string,
    senha: formData.get('senha') as string,
  };

  const validated = createUsuarioSchema.safeParse(rawData);
  
  if (!validated.success) {
    return {
      error: validated.error.errors[0].message,
    };
  }

  try {
    await api.usuarios.create(validated.data);
    revalidatePath('/usuarios');
    redirect('/usuarios');
  } catch (error: any) {
    return {
      error: error.message || 'Erro ao criar usuário',
    };
  }
}

export async function updateUsuario(id: string, formData: FormData) {
  const rawData: any = {};
  
  const email = formData.get('email');
  const senha = formData.get('senha');
  const ativo = formData.get('ativo');
  
  if (email) rawData.email = email as string;
  if (senha) rawData.senha = senha as string;
  if (ativo !== null) rawData.ativo = ativo === 'true';

  const validated = updateUsuarioSchema.safeParse(rawData);
  
  if (!validated.success) {
    return {
      error: validated.error.errors[0].message,
    };
  }

  try {
    await api.usuarios.update(id, validated.data);
    revalidatePath('/usuarios');
    revalidatePath(`/usuarios/${id}`);
    return { success: true };
  } catch (error: any) {
    return {
      error: error.message || 'Erro ao atualizar usuário',
    };
  }
}

export async function deleteUsuario(id: string) {
  try {
    await api.usuarios.delete(id);
    revalidatePath('/usuarios');
    return { success: true };
  } catch (error: any) {
    return {
      error: error.message || 'Erro ao excluir usuário',
    };
  }
}

export async function toggleUsuarioStatus(id: string, ativo: boolean) {
  try {
    await api.usuarios.update(id, { ativo });
    revalidatePath('/usuarios');
    revalidatePath(`/usuarios/${id}`);
    return { success: true };
  } catch (error: any) {
    return {
      error: error.message || 'Erro ao alterar status do usuário',
    };
  }
}
