import path from 'path';
import { expect } from '@playwright/test';
import { fileURLToPath } from 'url';


export class EmployeePage {
  constructor(page) {
    this.page = page;

    // Navigation
    this.pimMenu = page.getByRole('link', { name: 'PIM' });
    this.employeeHeader = page.getByRole('heading', { name: 'Employee Information' });
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.addEmployeeHeader = page.getByRole('heading', { name: 'Add Employee' });

    // Employee Form
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.middleNameInput = page.locator('input[name="middleName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.empIdInput = page.locator('input.oxd-input').nth(4);

    this.fileInput = page.locator('input[type="file"]');

    // Login Details
    this.toggleLogin = page.locator('.oxd-switch-wrapper');
    this.addLoginDetails = page.locator("//i[contains(@class,'bi-plus')]");

    this.usernameInput = page.locator('.oxd-input-group:has-text("Username") input');
    this.passwordInput = page.locator('input[type="password"]').nth(0);
    this.confirmPasswordInput = page.locator('input[type="password"]').nth(1);

    // Actions
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.successMessage = page.getByText('Successfully Saved');

    // Search
    this.searchNameDropdown = page.locator('.oxd-icon.bi-caret-down-fill').nth(1);
    this.searchNameInput = page.locator('input[placeholder="Type for hints..."]').nth(0);
    this.searchEmpIdInput = page.locator('input.oxd-input.oxd-input--active').nth(1);
    this.searchButton = page.getByRole('button', { name: 'Search' });

    this.tableBody = page.locator('.oxd-table-body');
  }

  async navigateToPIM() {
    await this.pimMenu.click();
    // await this.employeeHeader.waitFor();
  }

  async clickAddEmployee() {
    await this.addButton.click();
    await this.addEmployeeHeader.waitFor();
  }

  async uploadProfileImage() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const filePath = path.join(__dirname, '../testdata/ProfileImg.png');

    await this.fileInput.setInputFiles(filePath);
  }

  async fillEmployeeDetails(firstName, middleName, lastName, empId) {
    await this.firstNameInput.fill(firstName);
    await this.middleNameInput.fill(middleName);
    await this.lastNameInput.fill(lastName);
    await this.empIdInput.fill(empId.toString());
  }

  async enableLoginDetails(username, password) {
    await this.toggleLogin.click();
    await this.addLoginDetails.click();

    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
  }

  async saveEmployee() {
    await this.saveButton.click();
    await this.successMessage.waitFor();
  }

  async searchEmployee(firstName, empId) {
    await this.navigateToPIM();

    await this.searchNameDropdown.click();
    await this.searchNameInput.fill(firstName);
    await this.searchEmpIdInput.fill(empId.toString());

    await this.searchButton.click();
  }

  async verifyEmployeeDetails(firstName, middleName, lastName, empId) {
    await expect(this.firstNameInput).toHaveValue(firstName);
    await expect(this.middleNameInput).toHaveValue(middleName);
    await expect(this.lastNameInput).toHaveValue(lastName);
    await expect(this.empIdInput).toHaveValue(String(empId));
  }
}