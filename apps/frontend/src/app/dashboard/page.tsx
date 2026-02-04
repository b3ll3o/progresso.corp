export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Bem-vindo!</span>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total de Usuários" value="150" trend="+12%" />
          <StatCard title="Empresas Ativas" value="45" trend="+5%" />
          <StatCard title="Perfis Criados" value="89" trend="+8%" />
          <StatCard title="Permissões" value="32" trend="+2%" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Ações Rápidas
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <ActionButton href="/usuarios" label="Gerenciar Usuários" />
              <ActionButton href="/empresas" label="Gerenciar Empresas" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, trend }: { title: string; value: string; trend: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-gray-800">{value}</span>
        <span className="text-sm text-green-600 font-medium">{trend}</span>
      </div>
    </div>
  );
}

function ActionButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <span className="font-medium text-gray-700">{label}</span>
    </a>
  );
}
