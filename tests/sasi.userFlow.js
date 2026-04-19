import { test, expect } from '@playwright/test';
import{ LoginPage} from '../pages/LoginPage.js';
import { PIMPage } from '../pages/pimPage.js'
import env from '../config/env.js';

test('SC01-SC13 - Employee Creation and Search Flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const pimPage = new PIMPage(page);

  const uniqueId = Date.now().toString().slice(-5);
  const firstName = `testuser${uniqueId}`;
  const lastName = 'Sasi';
  const employeeId = `ID${uniqueId}`;
  const username = `testSasi${uniqueId}`;
  const password = 'Test@1234';
  const employeeName = `${firstName} ${lastName}`;

  // SC01 – Admin Login & Navigate to PIM
  await loginPage.navigate(env.baseURL);
  await loginPage.login(env.adminUser.username, env.adminUser.password);
  await expect(page.locator('h6').first()).toHaveText(/Dashboard|Pizarra de pendientes/);
  await pimPage.navigateToPIM();

  // SC02 – Search Employee (Initial Check)
  await pimPage.searchEmployee(employeeName);
  const noRecordsFound = await pimPage.verifyNoRecordsFound();

  // SC03 – Add Employee
  console.log('Proceeding to add employee');
  
  // SC04 – Create Login Details for Employee
  await pimPage.createEmployee(firstName, lastName, username, password, employeeId);

  // SC05 – Validate Created Employee Details
  await pimPage.navigateToPIM();
  await pimPage.searchEmployee(employeeName);
  await pimPage.clickEmployeeByName(employeeName);
  await expect(page.locator('input[name="firstName"]')).toHaveValue(firstName);
  await expect(page.locator('input[name="lastName"]')).toHaveValue(lastName);

  // SC06 – Search Created User (as Admin)
  await pimPage.navigateToPIM();
  await pimPage.searchEmployee(employeeName);
  const userExists = !(await pimPage.verifyNoRecordsFound());
  expect(userExists).toBeTruthy();

  // SC08 – Logout from Admin
  await page.click('.oxd-userdropdown-name');
  await page.click('text=Logout');
  await expect(page.locator('input[name="username"]')).toBeVisible();

  // Login with newly created user
  await loginPage.login(username, password);
  await expect(page.locator('h6').first()).toHaveText(/Dashboard|Pizarra de pendientes/);
  console.log('Successfully logged in with newly created user');


 //'SC09 - Employee Deletion Flow'

  // Logout from current user before fresh login
  try {
    await page.click('.oxd-userdropdown-name');
    await page.click('text=Logout');
    await page.waitForTimeout(1000);
  } catch (e) {
    // User might not be logged in, continue
  }

  // Fresh login for delete flow
  await loginPage.navigate(env.baseURL);
  await loginPage.login(env.adminUser.username, env.adminUser.password);
  await expect(page.locator('h6').first()).toHaveText(/Dashboard|Pizarra de pendientes/);
  await pimPage.navigateToPIM();

  // Search employee
  await pimPage.searchEmployee(employeeName);
  const employeeNotFound = await pimPage.verifyNoRecordsFound();

  if (employeeNotFound) {
    console.log('Employee not found - skipping deletion test');
    return;
  }

  // Delete employee from list page
  await pimPage.deleteEmployee(employeeName);
  await page.waitForTimeout(2000);
   
});
