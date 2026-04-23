export class LoginPage {

  constructor(page) {

    this.page = page
    // Login fields

    this.username = page.getByPlaceholder('Username')
    this.password = page.getByPlaceholder('Password')
    this.loginButton = page.getByRole('button', { name: 'Login' })

    // invalid credentials error message
    this.errorMsg = page.getByText('Invalid credentials')

    //Dashboard elements for Admin
    this.dashboard = page.getByRole('heading', { name: 'Dashboard' })

    // Menu items for Admin
    this.adminMenu = page.getByRole('link', { name: 'Admin' })
    this.pimMenu = page.getByRole('link', { name: 'PIM' })
    this.leaveMenu = page.getByRole('link', { name: 'Leave' })
    this.myInfoMenu = page.getByRole('link', { name: 'My Info' })
    this.profileDropdown = page.locator('.oxd-userdropdown-tab')
    this.logoutBtn = page.getByRole('menuitem', { name: 'Logout' })
  }

  async goto() {
    await this.page.goto('/web/index.php/auth/login')
  }

  async login(username, password) {
    await this.username.fill(username)
    await this.password.fill(password)
    await this.loginButton.click()
    await this.page.waitForLoadState('networkidle')
  }

  async logout() {
    await this.profileDropdown.click();
    await this.logoutBtn.click();
    await this.username.waitFor();
  }

}