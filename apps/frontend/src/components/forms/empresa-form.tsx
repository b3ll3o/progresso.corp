'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createEmpresa } from '@/app/actions/empresas';

const empresaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  responsavelId: z.coerce.number().min(1, 'Responsável é obrigatório'),
});

type EmpresaFormData = z.infer<typeof empresaSchema>;

interface EmpresaFormProps {
  usuarios: Array<{ id: number; email: string; nome?: string }>;
  onSuccess?: () => void;
}

export function EmpresaForm({ usuarios, onSuccess }: EmpresaFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmpresaFormData>({
    resolver: zodResolver(empresaSchema),
  });

  async function onSubmit(data: EmpresaFormData) {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('nome', data.nome);
      if (data.descricao) {
        formData.append('descricao', data.descricao);
      }
      formData.append('responsavelId', String(data.responsavelId));

      const result = await createEmpresa(formData);

      if (result?.error) {
        setError(result.error);
        return;
      }

      reset();
      onSuccess?.();
    } catch {
      setError('Erro ao criar empresa. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <Input
        label="Nome"
        placeholder="Nome da empresa"
        error={errors.nome?.message}
        {...register('nome')}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Descrição da empresa (opcional)"
          {...register('descricao')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Responsável
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          {...register('responsavelId', { valueAsNumber: true })}
        >
          <option value="">Selecione um responsável</option>
          {usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nome || usuario.email}
            </option>
          ))}
        </select>
        {errors.responsavelId && (
          <p className="mt-1 text-sm text-red-600">{errors.responsavelId.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            reset();
            setError(null);
          }}
        >
          Limpar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Criar Empresa
        </Button>
      </div>
    </form>
  );
}
