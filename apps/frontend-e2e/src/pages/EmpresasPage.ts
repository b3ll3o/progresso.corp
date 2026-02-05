import { Page, Locator, expect } from '@playwright/test';

export class EmpresasPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly createButton: Locator;
  readonly empresaList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /Empresas/i });
    this.createButton = page.getByRole('button', { name: 'Nova Empresa' });
    this.empresaList = page.locator('[data-testid="empresa-list"]');
  }

  async goto() {
    await this.page.goto('/empresas');
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
  }

  async clickCreateEmpresa() {
    await this.createButton.click();
  }

  async fillEmpresaForm(data: { nome: string; cnpj: string }) {
    await this.page.getByLabel('Nome').fill(data.nome);
    await this.page.getByLabel('CNPJ').fill(data.cnpj);
  }

  async submitForm() {
    await this.page.getByRole('button', { name: 'Salvar' }).click();
  }

  async expectEmpresaInList(nome: string) {
    await expect(this.page.getByText(nome)).toBeVisible();
  }
}
