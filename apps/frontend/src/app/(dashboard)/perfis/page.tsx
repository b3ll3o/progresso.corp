import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api/server-api';
import { deletePerfil } from '@/app/actions/perfis';
import { PerfilForm } from '@/components/forms/perfil-form';

export const metadata: Metadata = {
  title: 'Perfis - ProgressoCorp',
};

interface SearchParams {
  page?: string;
}

export default async function PerfisPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Number(searchParams.page) || 1;
  
  let perfis = [];
  let empresas = [];
  let permissoes = [];
  let error = null;
  
  try {
    const [perfisResponse, empresasResponse, permissoesResponse] = await Promise.all([
      api.perfis.list({ page, limit: 10 }),
      api.empresas.list({ limit: 100 }),
      api.permissoes.list({ limit: 100 }),
    ]);
    perfis = perfisResponse.data || [];
    empresas = empresasResponse.data || [];
    permissoes = permissoesResponse.data || [];
  } catch (e: any) {
    error = e.message || 'Erro ao carregar perfis';
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Perfis</h1>
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
                  {perfis.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        Nenhum perfil encontrado
                      </td>
                    </tr>
                  ) : (
                    perfis.map((perfil: any) => (
                      <tr key={perfil.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{perfil.nome}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            {perfil.codigo}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{perfil.descricao}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <form action={async () => {
                            'use server';
                            await deletePerfil(String(perfil.id));
                          }} className="inline">
                            <button
                              type="submit"
                              className="text-red-600 hover:text-red-900"
                              onClick={(e) => {
                                if (!confirm('Tem certeza que deseja excluir este perfil?')) {
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
          <Card title="Novo Perfil">
            <PerfilForm empresas={empresas} permissoes={permissoes} />
          </Card>
        </div>
      </div>
    </div>
  );
}
