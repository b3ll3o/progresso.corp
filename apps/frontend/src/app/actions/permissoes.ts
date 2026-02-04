'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { api } from '@/lib/api/server-api';

const createPermissaoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  codigo: z.string().min(1, 'Código é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
});

const updatePermissaoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').optional(),
  codigo: z.string().min(1, 'Código é obrigatório').optional(),
  descricao: z.string().min(1, 'Descrição é obrigatória').optional(),
  ativo: z.boolean().optional(),
});

export type CreatePermissaoInput = z.infer<typeof createPermissaoSchema>;
export type UpdatePermissaoInput = z.infer<typeof updatePermissaoSchema>;

export async function createPermissao(formData: FormData) {
  const rawData = {
    nome: formData.get('nome') as string,
    codigo: formData.get('codigo') as string,
    descricao: formData.get('descricao') as string,
  };

  const validated = createPermissaoSchema.safeParse(rawData);
  
  if (!validated.success) {
    return {
      error: validated.error.errors[0].message,
    };
  }

  try {
    await api.permissoes.create(validated.data);
    revalidatePath('/permissoes');
    revalidateTag('permissoes');
    redirect('/permissoes');
  } catch (error: any) {
    return {
      error: error.message || 'Erro ao criar permissão',
    };
  }
}

export async function updatePermissao(id: string, formData: FormData) {
  const rawData: any = {};
  
  const nome = formData.get('nome');
  const codigo = formData.get('codigo');
  const descricao = formData.get('descricao');
  const ativo = formData.get('ativo');
  
  if (nome) rawData.nome = nome as string;
  if (codigo) rawData.codigo = codigo as string;
  if (descricao) rawData.descricao = descricao as string;
  if (ativo !== null) rawData.ativo = ativo === 'true';

  const validated = updatePermissaoSchema.safeParse(rawData);
  
  if (!validated.success) {
    return {
      error: validated.error.errors[0].message,
    };
  }

  try {
    await api.permissoes.update(id, validated.data);
    revalidatePath('/permissoes');
    revalidateTag('permissoes');
    return { success: true };
  } catch (error: any) {
    return {
      error: error.message || 'Erro ao atualizar permissão',
    };
  }
}

export async function deletePermissao(id: string) {
  try {
    await api.permissoes.delete(id);
    revalidatePath('/permissoes');
    revalidateTag('permissoes');
    return { success: true };
  } catch (error: any) {
    return {
      error: error.message || 'Erro ao excluir permissão',
    };
  }
}
