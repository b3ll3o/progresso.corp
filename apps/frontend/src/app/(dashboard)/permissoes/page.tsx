import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api/server-api';
import { deletePermissao } from '@/app/actions/permissoes';
import { PermissaoForm } from '@/components/forms/permissao-form';

export const metadata: Metadata = {
  title: 'Permissões - ProgressoCorp',
};

interface SearchParams {
  page?: string;
}

export default async function PermissoesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Number(searchParams.page) || 1;
  
  let permissoes = [];
  let error = null;
  
  try {
    const response = await api.permissoes.list({ page, limit: 10 });
    permissoes = response.data || [];
  } catch (e: any) {
    error = e.message || 'Erro ao carregar permissões';
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Permissões</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {permissoes.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        Nenhuma permissão encontrada
                      </td>
                    </tr>
                  ) : (
                    permissoes.map((permissao: any) => (
                      <tr key={permissao.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{permissao.nome}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {permissao.codigo}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{permissao.descricao}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <form action={async () => {
                            'use server';
                            await deletePermissao(String(permissao.id));
                          }} className="inline">
                            <button
                              type="submit"
                              className="text-red-600 hover:text-red-900"
                              onClick={(e) => {
                                if (!confirm('Tem certeza que deseja excluir esta permissão?')) {
                                  e.preventDefault();
                                }
                              }}
                            >
                              Excluir
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div>
          <Card title="Nova Permissão">
            <PermissaoForm />
          </Card>
        </div>
      </div>
    </div>
  );
}
