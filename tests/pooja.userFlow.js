import { test } from '../fixtures/fixtures.js';
import { expect } from '@playwright/test';

test.describe('Login as Admin and verify access', () => {

  test('Admin access check', async ({ admin, page, pimPage}) => {

    await expect(admin.dashboard).toBeVisible()
    await page.waitForTimeout(5000)

    await expect(admin.adminMenu).toBeVisible()
    await expect(admin.pimMenu).toBeVisible()
    await expect(admin.leaveMenu).toBeVisible()

    await page.waitForTimeout(3000)

    // Test Data
    const firstName = 'Pooja'
    const lastName = 'Test'
    const employeeName = `${firstName} ${lastName}`;
    const username = 'test_pooja';
    const password = 'test123';
    const employeeId = `EMP${Date.now()}`;

    // Create Employee WITH login details
    await pimPage.createEmployee(firstName, lastName, username, password, employeeId)

  
    await page.waitForTimeout(2000)

  })

})

test.describe('Login as ESS User and verify restricted access', () => {

  test('ESS access check', async ({ essUser, page }) => {
    await page.waitForTimeout(5000)
    await expect(essUser.dashboard).toBeVisible()
    await page.waitForTimeout(2000)

    await expect(essUser.adminMenu).not.toBeVisible()
    await expect(essUser.pimMenu).not.toBeVisible()
    await expect(essUser.myInfoMenu).toBeVisible()

    await page.waitForTimeout(3000)


  })

})

test.describe('Invalid Login', () => {

  test('Invalid login check', async ({ loginPage, page }) => {

    await loginPage.login('wrongUser', 'wrongPass')

    await expect(loginPage.errorMsg).toBeVisible()
    await page.waitForTimeout(3000)

  })

})