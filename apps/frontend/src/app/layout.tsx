import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ProgressoCorp - Sistema de Gestão',
  description: 'Sistema completo de gestão empresarial com Next.js e NestJS',
  keywords: ['gestão', 'empresarial', 'Next.js', 'NestJS'],
  authors: [{ name: 'ProgressoCorp' }],
  openGraph: {
    title: 'ProgressoCorp',
    description: 'Sistema de Gestão Empresarial',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
