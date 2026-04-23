import { test, expect } from '@playwright/test';
import{ LoginPage} from '../pages/loginPage.js';
import { AddEmployeePage } from '../pages/addEmployeePage.js';
import env from '../config/env.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Login, Create and Search Emp', async ({ page }) => {

  const loginPage = new LoginPage(page);

                                  //-------// Login //-------// 
  await loginPage.navigate(env.baseURL);
  await loginPage.login(env.adminUser.username, env.adminUser.password);
  
  // Wait for network to be idle and dashboard to render
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Additional buffer
  
  await expect(page.locator('h6').first()).toHaveText(/Dashboard|Pizarra de pendientes/, { timeout: 10000 });
  
  // Go to PIM tab
  await page.getByRole('link', { name: 'PIM' }).click();
  await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
  await page.getByRole('button', { name: 'Add' }).click();

  // Check cancel button
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();

  //-------// Add Employee //-------// 
  const addEmployeePage = new AddEmployeePage(page);
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByText('Employee Full Name', { exact: true })).toBeVisible();

  // Upload profile pic
  const filePath = path.join(__dirname, '../utils/personFace.jpg');

  // Handle file upload via button click
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.locator('button.employee-image-action').click(),
  ]);
  await fileChooser.setFiles(filePath);
  
  // Filling the name
  const firstName = 'Asu';
  const lastName = 'PYA';
  await addEmployeePage.enterEmployeeDetails(firstName, lastName);

  // Get and Save the emp ID for later search use
  const empId = await page.locator('div.oxd-input-group label:has-text("Employee Id")').locator('xpath=../..').locator('input').inputValue();
  console.log('Captured Emp ID:', empId);

  // Save Employee
  await addEmployeePage.clickSave();
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000); // Wait for redirect to complete

  // Check it shows the Emp details
  await expect(page).toHaveURL(/viewPersonalDetails/, { timeout: 15000 });    
  await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();

                                  //-------// Search //-------// 
  // Search with the Emp name
  await page.getByRole('link', { name: 'PIM' }).click();
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().fill(firstName);
  await page.getByRole('button', { name: 'Search' }).click();

  // Verify search result - using first() to handle multiple results if they exist
  await expect(page.getByText(firstName).first()).toBeVisible();

  // Reset
  await page.getByRole('button', { name: 'Reset' }).click();

  // Search with Emp ID
  await page.locator('div.oxd-input-group label:has-text("Employee Id")').locator('xpath=../..').locator('input').fill(empId);
  await page.getByRole('button', { name: 'Search' }).click();

  // Verify search result
  await expect(page.getByText(empId).first()).toBeVisible();

  // Reset
  await page.getByRole('button', { name: 'Reset' }).click();

                                  //-------// Logout //-------// 
  // Click profile and logout
  await page.locator('i.oxd-icon.bi-caret-down-fill.oxd-userdropdown-icon').click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
  // Verify logged out
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
});