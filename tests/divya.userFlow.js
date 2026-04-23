import { test, expect } from '@playwright/test';
import{ LoginPage} from '../pages/loginPage.js';
import env from '../config/env.js';
import { AddEmployeePage } from '../pages/addEmployeePage.js';
test.describe('Add Employee Validations', () => {

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate(env.baseURL);
  await loginPage.login(env.adminUser.username, env.adminUser.password);
  
  // Wait for network to be idle and dashboard to render
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Additional buffer
  
  await expect(page.locator('h6').first()).toHaveText(/Dashboard|Pizarra de pendientes/, { timeout: 10000 });
});

test('Validate mandatory fields in Add Employee', async ({ page }) => {
  const addEmployeePage = new AddEmployeePage(page);

  await addEmployeePage.pimBtn.click();
  await addEmployeePage.addEmployeeBtn.click();

  await addEmployeePage.enableLoginDetails();
  await addEmployeePage.clickSave();

  await expect(page.getByText('Required').first()).toBeVisible();
});

test('Invalid input validation in Add Employee', async ({ page }) => {
  const addEmployeePage = new AddEmployeePage(page);

  const username = `user${Date.now()}`;

  await addEmployeePage.pimBtn.click();
  await addEmployeePage.addEmployeeBtn.click();

  await addEmployeePage.enterEmployeeDetails('@@@', '123');

  await addEmployeePage.enableLoginDetails();

  await addEmployeePage.enterLoginDetails(
    username,
    'Password123',
    'Password123!'
  );

  await addEmployeePage.clickSave();

  await expect(page.getByText(/passwords do not match/i)).toBeVisible();
});

test('Boundary value check in Add Employee', async ({ page }) => {
  const addEmployeePage = new AddEmployeePage(page);

  const longInput = 'a'.repeat(200);

  await addEmployeePage.pimBtn.click();
  await addEmployeePage.addEmployeeBtn.click();

  await addEmployeePage.enterEmployeeDetails(longInput, longInput);

  await addEmployeePage.enableLoginDetails();

  await addEmployeePage.enterLoginDetails(
    longInput,
    longInput,
    longInput
  );

  await addEmployeePage.clickSave();

  await expect(page.locator('input[name="firstName"]')).toHaveValue(/a+/);
});

test('Valid employee creation ', async ({ page }) => {
  const addEmployeePage = new AddEmployeePage(page);

  const uniqueId = Date.now();
  const username = `user${uniqueId}`;

  await addEmployeePage.pimBtn.click();
  await addEmployeePage.addEmployeeBtn.click();

  await addEmployeePage.enterEmployeeDetails('John', 'Doe');

  await addEmployeePage.enableLoginDetails();

  await addEmployeePage.enterLoginDetails(
    username,
    'Password123!',
    'Password123!'
  );

  await Promise.all([
  page.waitForURL(/viewPersonalDetails/, { timeout: 20000 }),
  addEmployeePage.clickSave()
]);
});
})
test.describe('Login Page Validations', () => {

  test('Validate mandatory fields', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate(env.baseURL);
    await loginPage.login('', '');

    await expect(page.getByText('Required').first()).toBeVisible();
    await expect(page.getByText('Required').nth(1)).toBeVisible();
  });

  test('Invalid login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate(env.baseURL);
    await loginPage.login(
      env.invaliuser.username,
      env.invaliuser.password
    );

    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('Boundary value check', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate(env.baseURL);
    await loginPage.login('A'.repeat(100), 'B'.repeat(100));

    await expect(loginPage.errorMessage).toBeVisible();
  });

});