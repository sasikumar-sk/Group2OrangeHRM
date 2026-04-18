export class PIMPage {
  constructor(page) {
    this.page = page;

    this.pimMenu = page.locator('.oxd-main-menu-item--name').filter({ hasText: 'PIM' });
    this.addEmployeeBtn = page.locator('text=Add Employee');
    this.firstName = page.locator('input[name="firstName"]');
    this.lastName = page.locator('input[name="lastName"]');
    this.saveBtn = page.locator('button[type="submit"]');
  }

  async navigateToPIM() {
    try {
      await this.pimMenu.waitFor({ state: 'visible', timeout: 5000 });
      await this.pimMenu.click();
      // Wait for navigation to complete
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    } catch (error) {
      console.error('Failed to click PIM menu:', error.message);
      throw error; // Re-throw to fail the test explicitly
    }
  }

  async createEmployee(firstName, lastName, username, password, employeeId) {
    await this.addEmployeeBtn.click();
    // Wait for Add Employee header to be visible instead of networkidle
    await this.page.waitForSelector('h6', { timeout: 10000 }).catch(() => {
      // Fallback to loadstate if selector not found
      return this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
    });

    await this.page.fill('input[name="firstName"]', firstName);
    await this.page.fill('input[name="lastName"]', lastName);

    if (employeeId) {
      await this.page.locator('input[class="oxd-input oxd-input--active"]').last().fill(employeeId);
    }

    // Click Create Login Details toggle
    await this.page.locator('.oxd-switch-input').click();
    await this.page.waitForTimeout(500);

    // Fill username
    try {
      const usernameInput = this.page.locator('input[placeholder*="username"]').first();
      await usernameInput.waitFor({ state: 'visible', timeout: 3000 });
      await usernameInput.fill(username);
    } catch (error) {
      // Fallback: find by label or use index
      await this.page.locator('.oxd-input-group').filter({ hasText: 'Username' }).locator('input').fill(username);
    }

    // Fill password fields
    const passwordInputs = this.page.locator('input[type="password"]');
    await passwordInputs.nth(0).fill(password);
    await passwordInputs.nth(1).fill(password);

    // Select Status - Enabled 
    try {
      const enabledLabel = this.page.locator('label').filter({ hasText: 'Enabled' });
      if (await enabledLabel.isVisible().catch(() => false)) {
        await enabledLabel.click();
      } else {
        console.log('Status field not visible, skipping');
      }
    } catch (error) {
      console.log('Status selection failed, continuing:', error.message);
    }

    await this.saveBtn.click();
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });

    // Wait for success toast
    try {
      await this.page.waitForSelector('.oxd-toast', { state: 'visible', timeout: 10000 });
      console.log('Employee created successfully with login details');
    } catch (error) {
      console.error('Employee creation success toast not visible');
    }
  }

  async clickEmployeeByName(employeeName) {
    const employeeLink = this.page.locator(`text=${employeeName}`).first();
    await employeeLink.waitFor({ state: 'visible', timeout: 10000 });
    await employeeLink.click();
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });
  }

  async verifyNoRecordsFound() {
    const noRecords = this.page.locator('text=/No Records Found|No se encontraron registros/');
    try {
      await noRecords.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch (e) {
      return false;
    }
  }

  async searchEmployee(employeeName) {
    // Wait for the search input to be visible before interacting
    try {
      const searchInput = this.page.locator('input[placeholder*="Type for hints"], input[placeholder*="sugerencias"]').first();
      await searchInput.waitFor({ state: 'visible', timeout: 10000 });
      await searchInput.fill(employeeName);
    } catch (error) {

      console.log('Primary search locator failed, trying fallback:', error.message);
      const fallbackInput = this.page.locator('input[class*="oxd-input"]').filter({
        has: this.page.locator('[placeholder*="Type for hints"], [placeholder*="sugerencias"]')
      }).first();
      await fallbackInput.waitFor({ state: 'visible', timeout: 10000 });
      await fallbackInput.fill(employeeName);
    }

    await this.page.click('button[type="submit"]');
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });
  }

  async deleteEmployee(employeeName) {
    try {
      await this.searchEmployee(employeeName);
      // Select the first employee checkbox
      const checkbox = this.page.locator('.oxd-checkbox-input').first();
      await checkbox.waitFor({ state: 'visible', timeout: 5000 });
      await checkbox.click();
      console.log('Checkbox selected');
      await this.page.waitForTimeout(500);

      // Click delete button from toolbar - button with trash icon
      const deleteBtn = this.page.locator('button i[class*="trash"]').first();
      await deleteBtn.waitFor({ state: 'visible', timeout: 5000 });
      await deleteBtn.click();
      console.log('Delete button clicked');
      await this.page.waitForTimeout(500);

      // Confirm deletion
      const confirmBtn = this.page.getByRole('button', { name: /Yes, Delete|Sí, Eliminar/ });
      await confirmBtn.waitFor({ state: 'visible', timeout: 5000 });
      await confirmBtn.click();
      console.log('Deletion confirmed');
      await this.page.waitForTimeout(2000);

      // Check if employee still exists after deletion
      const employeeLink = this.page.locator(`text=${employeeName}`).first();
      if (await employeeLink.isVisible().catch(() => false)) {
        console.error(`Employee ${employeeName} still exists after deletion`);
      } else {
        console.log(`Employee ${employeeName} successfully deleted`);
      }
    } catch (error) {
      console.error('Error during deletion:', error.message);
      throw error;
    }
  }
}