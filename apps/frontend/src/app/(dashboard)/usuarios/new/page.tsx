import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Novo Usuário - ProgressoCorp',
};

export default function NovoUsuarioPage() {
  return (
    <div>
      <h1>Novo Usuário</h1>
    </div>
  );
}
