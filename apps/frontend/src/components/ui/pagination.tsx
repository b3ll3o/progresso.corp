import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
      <div className="flex items-center">
        <p className="text-sm text-gray-700">
          Página <span className="font-medium">{currentPage}</span> de{' '}
          <span className="font-medium">{totalPages}</span>
        </p>
      </div>
      <div className="flex items-center space-x-2">
        {currentPage > 1 && (
          <Link
            href={`${baseUrl}?page=${currentPage - 1}`}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Link>
        )}

        {pages.map((page) => (
          <Link
            key={page}
            href={`${baseUrl}?page=${page}`}
            className={cn(
              'inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md',
              currentPage === page
                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            )}
          >
            {page}
          </Link>
        ))}

        {currentPage < totalPages && (
          <Link
            href={`${baseUrl}?page=${currentPage + 1}`}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Próxima
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        )}
      </div>
    </div>
  );
}
