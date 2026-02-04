export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">ProgressoCorp</h1>
          <p className="text-blue-100 text-lg">
            Sistema de Gestão Empresarial Moderno
          </p>
        </div>
        
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Bem-vindo ao seu sistema
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Gerencie usuários, empresas, permissões e muito mais com nossa
                plataforma completa construída com as melhores tecnologias.
              </p>
              
              <div className="flex gap-4 pt-4">
                <a
                  href="/login"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Acessar Sistema
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
                <a
                  href="/dashboard"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Dashboard
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FeatureCard
                icon="👥"
                title="Usuários"
                description="Gerenciamento completo de usuários"
              />
              <FeatureCard
                icon="🏢"
                title="Empresas"
                description="Controle de empresas e filiais"
              />
              <FeatureCard
                icon="🔐"
                title="Permissões"
                description="Sistema RBAC avançado"
              />
              <FeatureCard
                icon="📊"
                title="Relatórios"
                description="Análises e dashboards"
              />
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <TechBadge name="Next.js 15" />
              <TechBadge name="NestJS 11" />
              <TechBadge name="TypeScript" />
              <TechBadge name="Prisma" />
              <TechBadge name="Tailwind CSS" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function TechBadge({ name }: { name: string }) {
  return (
    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
      {name}
    </span>
  );
}
