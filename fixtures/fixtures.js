import { test as base } from '@playwright/test'
import { LoginPage } from '../pages/login'

const test = base.extend({

  // Basic login page (wrong creds)
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await use(loginPage)
  },

  // Admin logged-in session
  admin: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('Admin', 'admin123')
    await use(loginPage)
  },

  // ESS user logged-in session
  essUser: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('test_pooja', 'test123')
    await use(loginPage)
  },

})

export { test }
