import { test, expect } from '../../fixtures/auth.fixture';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('E2E: Dashboard', () => {
  test.describe('Navegação', () => {
    test('deve exibir cards de estatísticas', async ({ page }) => {
      // Arrange - Login
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('admin@progresso.corp', '123456');

      // Act
      const dashboardPage = new DashboardPage(page);
      await dashboardPage.goto();

      // Assert
      await dashboardPage.expectLoaded();
      await dashboardPage.expectStatsCardsVisible();
    });

    test('deve navegar para empresas via quick action', async ({ page }) => {
      // Arrange - Login
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('admin@progresso.corp', '123456');

      const dashboardPage = new DashboardPage(page);
      await dashboardPage.goto();

      // Act
      await dashboardPage.clickQuickAction('Empresas');

      // Assert
      await expect(page).toHaveURL('/empresas');
    });
  });
});
