import { test, expect } from '@playwright/test';
import{ LoginPage} from '../pages/LoginPage.js';
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
  await expect(page.locator('h6').first()).toHaveText(/Dashboard|Pizarra de pendientes/);
  await page.waitForLoadState('networkidle');
  
  // Go to PIM tab
  await page.getByRole('link', { name: 'PIM' }).click();
  await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
  await page.getByRole('button', { name: 'Add' }).click();

  // Check cancel button
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();

                                    //-------// Add Employee //-------// 
  // Again go to Add Emp section
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
  await page.getByRole('textbox', { name: 'First Name' }).fill('Asu');
  await page.getByRole('textbox', { name: 'Middle Name' }).fill('Test');
  await page.getByRole('textbox', { name: 'Last Name' }).fill('PYA');

  // Check Emp ID visible and not empty
  await expect(page.getByText('Employee Id')).toBeVisible();
  await expect(page.locator("//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@class='oxd-input oxd-input--active']")).not.toHaveValue('');
  
  // If Emp ID already present, enter unique id
  let isDuplicate = false;
  try {
    await page.getByText('Employee Id already exists', { exact: true }).waitFor({ timeout: 3000 });
    isDuplicate = true;
  } catch (e) {
    isDuplicate = false;
  }
  if (isDuplicate) {
    const empIdField = page.getByText('Employee Id');
    const newEmpId = Date.now().toString();

    await empIdField.fill('');
    await empIdField.fill(newEmpId);

    await page.getByRole('button', { name: 'Save' }).click();
  }

  // Save the emp ID for later search use
  const empId = await page.locator("//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@class='oxd-input oxd-input--active']").inputValue();
  console.log('Captured Emp ID:', empId);

  // Save Employee
  await page.getByRole('button', { name: 'Save' }).click();
  const isVisible = await page.getByText('Successfully Saved').isVisible();
  if (isVisible) {
    console.log('Success message displayed');
  } else {
    console.log('Success message not displayed, continuing...');
  }
  await page.waitForLoadState('networkidle');

  // Check it shows the Emp details
  await expect(page).toHaveURL(/viewPersonalDetails/);
  await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();

                                  //-------// Search //-------// 
  // Search with the Emp name
  await page.getByRole('link', { name: 'PIM' }).click();
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().fill('Asu');
  await page.getByRole('button', { name: 'Search' }).click();

  // Verify search result
  await expect(page.getByText('Asu')).toBeVisible();

  // Reset
  await page.getByRole('button', { name: 'Reset' }).click();

  // Search with Emp ID
  await page.locator("//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@class='oxd-input oxd-input--active']").fill(empId);
  await page.getByRole('button', { name: 'Search' }).click();

  // Verify search result
  await expect(page.getByText(empId)).toBeVisible();

  // Reset
  await page.getByRole('button', { name: 'Reset' }).click();

                                  //-------// Logout //-------// 
  // Click profile and logout
  await page.locator('i.oxd-icon.bi-caret-down-fill.oxd-userdropdown-icon').click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
  // Verify logged out
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
});