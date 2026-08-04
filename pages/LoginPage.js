export class LoginPage {
  constructor(page) {
    this.page = page;

    // Locators
   this.username = page.locator('input[name="email"]');
this.password = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
  }

  async navigate() {
    await this.page.goto('auth/login');
  }

  async login(username, password) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}