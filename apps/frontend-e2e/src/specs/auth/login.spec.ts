import { test, expect } from '../../fixtures/auth.fixture';
import { LoginPage } from '../../pages/LoginPage';

test.describe('E2E: Fluxo de Autenticação (Frontend)', () => {
  test.describe('Página de Login', () => {
    test('deve exibir formulário de login corretamente', async ({
      loginPage,
    }) => {
      // Assert
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.submitButton).toBeVisible();
    });

    test('deve redirecionar para dashboard após login bem-sucedido', async ({
      page,
    }) => {
      // Arrange
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      // Act
      await loginPage.login('admin@progresso.corp', '123456');

      // Assert
      await loginPage.expectLoginSuccess();
      await expect(
        page.getByRole('heading', { name: /Dashboard/i }),
      ).toBeVisible();
    });

    test('deve exibir mensagem de erro com credenciais inválidas', async ({
      page,
    }) => {
      // Arrange
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      // Act
      await loginPage.login('email-invalido@teste.com', 'senha-errada');

      // Assert
      await loginPage.expectLoginError('Credenciais inválidas');
    });

    test('deve validar campo de email obrigatório', async ({ page }) => {
      // Arrange
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      // Act
      await loginPage.passwordInput.fill('qualquer-senha');
      await loginPage.submitButton.click();

      // Assert
      await expect(page.getByText('Email é obrigatório')).toBeVisible();
    });

    test('deve validar campo de senha obrigatório', async ({ page }) => {
      // Arrange
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      // Act
      await loginPage.emailInput.fill('teste@exemplo.com');
      await loginPage.submitButton.click();

      // Assert
      await expect(page.getByText('Senha é obrigatória')).toBeVisible();
    });
  });

  test.describe('Sessão e Logout', () => {
    test('deve manter sessão ao navegar entre páginas', async ({ page }) => {
      // Arrange - Login
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('admin@progresso.corp', '123456');

      // Act - Navegar para outra página
      await page.goto('/empresas');

      // Assert - Deve estar logado
      await expect(
        page.getByRole('heading', { name: /Empresas/i }),
      ).toBeVisible();
      await expect(page.getByText('admin@progresso.corp')).toBeVisible();
    });

    test('deve redirecionar para login ao tentar acessar página protegida sem autenticação', async ({
      page,
    }) => {
      // Arrange - Garantir que não está logado
      await page.context().clearCookies();

      // Act - Tentar acessar página protegida
      await page.goto('/dashboard');

      // Assert - Deve redirecionar para login
      await expect(page).toHaveURL('/login');
    });
  });
});
