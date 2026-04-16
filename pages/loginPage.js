export class LoginPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginBtn = page.locator('button[type="submit"]');
  }

  async navigate(url) {
    await this.page.goto(url);
    await this.page.waitForSelector('input[name="username"]', { timeout: 10000 });
  }

  async login(username, password) {
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.loginBtn.click();
    await this.page.waitForSelector('h6', { timeout: 10000 });
  }
}