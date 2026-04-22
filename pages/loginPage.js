export class LoginPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginBtn = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByText('Invalid credentials')
  }

  async navigate(url) {
    await this.page.goto(url);
    await this.page.waitForSelector('input[name="username"]', { timeout: 10000 });
  }

  async login(username, password) {
    if (username) await this.page.fill('input[name="username"]', username);
    if (password) await this.page.fill('input[name="password"]', password);
    await this.loginBtn.click();
  }

  async waitForDashboard() {
    await this.page.locator('h6:has-text("Dashboard"), h6:has-text("Pizarra de pendientes")').waitFor({ state: 'visible', timeout: 15000 });
  }
}