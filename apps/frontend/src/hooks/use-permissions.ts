'use client';

import { useSession } from 'next-auth/react';

export function usePermissions() {
  const { data: session } = useSession();

  const hasPermission = (codigo: string): boolean => {
    if (!session?.empresas) return false;
    
    // Verifica em todas as empresas do usuário
    return session.empresas.some((empresa) =>
      empresa.perfis.some((perfil) =>
        perfil.permissoes.some((permissao) => permissao.codigo === codigo)
      )
    );
  };

  const hasAnyPermission = (codigos: string[]): boolean => {
    return codigos.some((codigo) => hasPermission(codigo));
  };

  const hasAllPermissions = (codigos: string[]): boolean => {
    return codigos.every((codigo) => hasPermission(codigo));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions: session?.empresas?.flatMap((e) =>
      e.perfis.flatMap((p) => p.permissoes.map((perm) => perm.codigo))
    ) || [],
  };
}

// Hook para verificar permissões específicas de módulos
export function useModulePermissions() {
  const { hasPermission } = usePermissions();

  return {
    // Usuários
    canCreateUsuario: hasPermission('CREATE_USUARIO'),
    canReadUsuarios: hasPermission('READ_USUARIOS'),
    canUpdateUsuario: hasPermission('UPDATE_USUARIO'),
    canDeleteUsuario: hasPermission('DELETE_USUARIO'),

    // Empresas
    canCreateEmpresa: hasPermission('CREATE_EMPRESA'),
    canReadEmpresas: hasPermission('READ_EMPRESAS'),
    canUpdateEmpresa: hasPermission('UPDATE_EMPRESA'),
    canDeleteEmpresa: hasPermission('DELETE_EMPRESA'),

    // Perfis
    canCreatePerfil: hasPermission('CREATE_PERFIL'),
    canReadPerfis: hasPermission('READ_PERFIS'),
    canUpdatePerfil: hasPermission('UPDATE_PERFIL'),
    canDeletePerfil: hasPermission('DELETE_PERFIL'),

    // Permissões
    canCreatePermissao: hasPermission('CREATE_PERMISSAO'),
    canReadPermissoes: hasPermission('READ_PERMISSOES'),
    canUpdatePermissao: hasPermission('UPDATE_PERMISSAO'),
    canDeletePermissao: hasPermission('DELETE_PERMISSAO'),
  };
}
