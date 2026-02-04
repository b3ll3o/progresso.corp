'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createPermissao } from '@/app/actions/permissoes';

const permissaoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  codigo: z.string().min(1, 'Código é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
});

type PermissaoFormData = z.infer<typeof permissaoSchema>;

interface PermissaoFormProps {
  onSuccess?: () => void;
}

export function PermissaoForm({ onSuccess }: PermissaoFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PermissaoFormData>({
    resolver: zodResolver(permissaoSchema),
  });

  async function onSubmit(data: PermissaoFormData) {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('nome', data.nome);
      formData.append('codigo', data.codigo);
      formData.append('descricao', data.descricao);

      const result = await createPermissao(formData);

      if (result?.error) {
        setError(result.error);
        return;
      }

      reset();
      onSuccess?.();
    } catch {
      setError('Erro ao criar permissão. Tente novamente.');
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
        placeholder="Ex: Criar usuário, Editar empresa"
        error={errors.nome?.message}
        {...register('nome')}
      />

      <Input
        label="Código"
        placeholder="Ex: CREATE_USUARIO, UPDATE_EMPRESA"
        error={errors.codigo?.message}
        {...register('codigo')}
      />

      <Input
        label="Descrição"
        placeholder="Descrição da permissão"
        error={errors.descricao?.message}
        {...register('descricao')}
      />

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
          Criar Permissão
        </Button>
      </div>
    </form>
  );
}
