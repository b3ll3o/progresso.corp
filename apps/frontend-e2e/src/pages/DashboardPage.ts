import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly statsCards: Locator;
  readonly quickActions: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /Dashboard/i });
    this.statsCards = page.locator('[data-testid="stats-card"]');
    this.quickActions = page.locator('[data-testid="quick-action"]');
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
  }

  async expectStatsCardsVisible() {
    await expect(this.statsCards.first()).toBeVisible();
  }

  async clickQuickAction(actionName: string) {
    await this.page.getByRole('link', { name: actionName }).click();
  }
}
