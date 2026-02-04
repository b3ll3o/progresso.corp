import { Metadata } from 'next';
import { Card } from '@/components/ui/card';
import { auth } from '@/lib/auth/auth';
import {
  Users,
  Building2,
  UserCog,
  Shield,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard - ProgressoCorp',
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
}

function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-8 w-8 text-blue-600" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="truncate text-sm font-medium text-gray-500">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              {trend && (
                <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                  {trend}
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </Card>
  );
}

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Bem-vindo, {session?.user?.name || session?.user?.email}
      </h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Usuários"
          value="--"
          icon={Users}
          trend="+12%"
        />
        <StatCard
          title="Empresas"
          value="--"
          icon={Building2}
          trend="+5%"
        />
        <StatCard
          title="Perfis"
          value="--"
          icon={UserCog}
          trend="+8%"
        />
        <StatCard
          title="Permissões"
          value="--"
          icon={Shield}
          trend="+2%"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title="Ações Rápidas">
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/usuarios/new"
              className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="text-center">
                <Users className="mx-auto h-8 w-8 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Novo Usuário
                </span>
              </div>
            </a>
            <a
              href="/empresas/new"
              className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="text-center">
                <Building2 className="mx-auto h-8 w-8 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Nova Empresa
                </span>
              </div>
            </a>
          </div>
        </Card>

        <Card title="Atividades Recentes">
          <div className="text-center text-gray-500 py-8">
            <p>Nenhuma atividade recente</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
