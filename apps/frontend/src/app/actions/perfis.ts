'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { api } from '@/lib/api/server-api';

const createPerfilSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  codigo: z.string().min(1, 'Código é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  empresaId: z.string().min(1, 'Empresa é obrigatória'),
  permissoesIds: z.array(z.number()).optional(),
});

const updatePerfilSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').optional(),
  codigo: z.string().min(1, 'Código é obrigatório').optional(),
  descricao: z.string().min(1, 'Descrição é obrigatória').optional(),
  ativo: z.boolean().optional(),
});

export type CreatePerfilInput = z.infer<typeof createPerfilSchema>;
export type UpdatePerfilInput = z.infer<typeof updatePerfilSchema>;

export async function createPerfil(formData: FormData) {
  const permissoesIdsStr = formData.get('permissoesIds') as string;
  const rawData = {
    nome: formData.get('nome') as string,
    codigo: formData.get('codigo') as string,
    descricao: formData.get('descricao') as string,
    empresaId: formData.get('empresaId') as string,
    permissoesIds: permissoesIdsStr ? permissoesIdsStr.split(',').map(Number) : undefined,
  };

  const validated = createPerfilSchema.safeParse(rawData);
  
  if (!validated.success) {
    return {
      error: validated.error.errors[0].message,
    };
  }

  try {
    await api.perfis.create(validated.data);
    revalidatePath('/perfis');
    redirect('/perfis');
  } catch (error: any) {
    return {
      error: error.message || 'Erro ao criar perfil',
    };
  }
}

export async function updatePerfil(id: string, formData: FormData) {
  const rawData: any = {};
  
  const nome = formData.get('nome');
  const codigo = formData.get('codigo');
  const descricao = formData.get('descricao');
  const ativo = formData.get('ativo');
  
  if (nome) rawData.nome = nome as string;
  if (codigo) rawData.codigo = codigo as string;
  if (descricao) rawData.descricao = descricao as string;
  if (ativo !== null) rawData.ativo = ativo === 'true';

  const validated = updatePerfilSchema.safeParse(rawData);
  
  if (!validated.success) {
    return {
      error: validated.error.errors[0].message,
    };
  }

  try {
    await api.perfis.update(id, validated.data);
    revalidatePath('/perfis');
    revalidatePath(`/perfis/${id}`);
    return { success: true };
  } catch (error: any) {
    return {
      error: error.message || 'Erro ao atualizar perfil',
    };
  }
}

export async function deletePerfil(id: string) {
  try {
    await api.perfis.delete(id);
    revalidatePath('/perfis');
    return { success: true };
  } catch (error: any) {
    return {
      error: error.message || 'Erro ao excluir perfil',
    };
  }
}
