import { Metadata } from 'next';
import { LoginForm } from '@/components/forms/login-form';

export const metadata: Metadata = {
  title: 'Login - ProgressoCorp',
  description: 'Entre no sistema ProgressoCorp',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">ProgressoCorp</h1>
          <p className="mt-2 text-gray-600">Entre com suas credenciais</p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
