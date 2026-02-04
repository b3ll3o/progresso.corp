module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Novas funcionalidades
        'fix',      // Correções de bugs
        'docs',     // Documentação
        'style',    // Formatação (espaços, indentação, etc.)
        'refactor', // Refatoração de código
        'perf',     // Melhorias de performance
        'test',     // Testes
        'chore',    // Tarefas de build/config
        'ci',       // CI/CD
        'build',    // Build do projeto
        'revert',   // Revertendo commits
      ],
    ],
    'subject-case': [0, 'never', 'sentence-case'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
  },
};
