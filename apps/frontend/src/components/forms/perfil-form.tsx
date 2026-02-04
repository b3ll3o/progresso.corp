'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createPerfil } from '@/app/actions/perfis';

const perfilSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  codigo: z.string().min(1, 'Código é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  empresaId: z.string().min(1, 'Empresa é obrigatória'),
  permissoesIds: z.array(z.number()).optional(),
});

type PerfilFormData = z.infer<typeof perfilSchema>;

interface PerfilFormProps {
  empresas: Array<{ id: string; nome: string }>;
  permissoes: Array<{ id: number; nome: string; codigo: string }>;
  onSuccess?: () => void;
}

export function PerfilForm({ empresas, permissoes, onSuccess }: PerfilFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPermissoes, setSelectedPermissoes] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
  });

  async function onSubmit(data: PerfilFormData) {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('nome', data.nome);
      formData.append('codigo', data.codigo);
      formData.append('descricao', data.descricao);
      formData.append('empresaId', data.empresaId);
      if (selectedPermissoes.length > 0) {
        formData.append('permissoesIds', selectedPermissoes.join(','));
      }

      const result = await createPerfil(formData);

      if (result?.error) {
        setError(result.error);
        return;
      }

      reset();
      setSelectedPermissoes([]);
      onSuccess?.();
    } catch {
      setError('Erro ao criar perfil. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  function togglePermissao(id: number) {
    setSelectedPermissoes((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
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
        placeholder="Nome do perfil"
        error={errors.nome?.message}
        {...register('nome')}
      />

      <Input
        label="Código"
        placeholder="Ex: ADMIN, USER, GERENTE"
        error={errors.codigo?.message}
        {...register('codigo')}
      />

      <Input
        label="Descrição"
        placeholder="Descrição do perfil"
        error={errors.descricao?.message}
        {...register('descricao')}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Empresa
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          {...register('empresaId')}
        >
          <option value="">Selecione uma empresa</option>
          {empresas.map((empresa) => (
            <option key={empresa.id} value={empresa.id}>
              {empresa.nome}
            </option>
          ))}
        </select>
        {errors.empresaId && (
          <p className="mt-1 text-sm text-red-600">{errors.empresaId.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Permissões
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-lg">
          {permissoes.map((permissao) => (
            <label
              key={permissao.id}
              className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedPermissoes.includes(permissao.id)}
                onChange={() => togglePermissao(permissao.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{permissao.nome}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            reset();
            setError(null);
            setSelectedPermissoes([]);
          }}
        >
          Limpar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Criar Perfil
        </Button>
      </div>
    </form>
  );
}
