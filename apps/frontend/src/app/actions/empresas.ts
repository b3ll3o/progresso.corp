'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { api } from '@/lib/api/server-api';

const createEmpresaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  responsavelId: z.coerce.number().min(1, 'Responsável é obrigatório'),
});

const updateEmpresaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').optional(),
  descricao: z.string().optional(),
  ativo: z.boolean().optional(),
});

type CreateEmpresaInput = z.infer<typeof createEmpresaSchema>;
type UpdateEmpresaInput = z.infer<typeof updateEmpresaSchema>;

export async function createEmpresa(formData: FormData) {
  const rawData = {
    nome: formData.get('nome') as string,
    descricao: (formData.get('descricao') as string) || undefined,
    responsavelId: Number(formData.get('responsavelId')),
  };

  const validated = createEmpresaSchema.safeParse(rawData);
  
  if (!validated.success) {
    return {
      error: validated.error.errors[0].message,
    };
  }

  try {
    await api.empresas.create(validated.data);
    revalidatePath('/empresas');
    redirect('/empresas');
  } catch (error: any) {
    return {
      error: error.message || 'Erro ao criar empresa',
    };
  }
}

export async function updateEmpresa(id: string, formData: FormData) {
  const rawData: any = {};
  
  const nome = formData.get('nome');
  const descricao = formData.get('descricao');
  const ativo = formData.get('ativo');
  
  if (nome) rawData.nome = nome as string;
  if (descricao) rawData.descricao = descricao as string;
  if (ativo !== null) rawData.ativo = ativo === 'true';

  const validated = updateEmpresaSchema.safeParse(rawData);
  
  if (!validated.success) {
    return {
      error: validated.error.errors[0].message,
    };
  }

  try {
    await api.empresas.update(id, validated.data);
    revalidatePath('/empresas');
    revalidatePath(`/empresas/${id}`);
    return { success: true };
  } catch (error: any) {
    return {
      error: error.message || 'Erro ao atualizar empresa',
    };
  }
}

export async function deleteEmpresa(id: string) {
  try {
    await api.empresas.delete(id);
    revalidatePath('/empresas');
    return { success: true };
  } catch (error: any) {
    return {
      error: error.message || 'Erro ao excluir empresa',
    };
  }
}

export async function addUsuarioToEmpresa(
  empresaId: string,
  data: { usuarioId: number; perfilIds: number[] }
) {
  try {
    await api.empresas.addUsuario(empresaId, data);
    revalidatePath(`/empresas/${empresaId}`);
    revalidatePath(`/empresas/${empresaId}/usuarios`);
    return { success: true };
  } catch (error: any) {
    return {
      error: error.message || 'Erro ao adicionar usuário à empresa',
    };
  }
}
