import { test, expect } from '@playwright/test';
import { login } from '../utils/LoginFile.js';
import { EmployeePage } from '../pages/Employeepage.js';
import dotenv from 'dotenv';

dotenv.config();

// 🔹 Shared test data
let testData = {};

test.describe.serial('Employee Module Tests', () => {

  let page;
  let employeePage;

  // 🔥 Login once
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    employeePage = new EmployeePage(page);

    await login(page, process.env.APP_USERNAME, process.env.APP_PASSWORD);
  });

  test('Create Employee Test', async () => {

    const uniqueId = Date.now();

    testData.firstName = `John${uniqueId}`;
    testData.middleName = `A${uniqueId}`;
    testData.lastName = `Doe${uniqueId}`;
    testData.empId = Math.floor(1000 + Math.random() * 9000);

    await employeePage.navigateToPIM();
    await employeePage.clickAddEmployee();
    await employeePage.uploadProfileImage();

    await employeePage.fillEmployeeDetails(
      testData.firstName,
      testData.middleName,
      testData.lastName,
      testData.empId
    );

    await employeePage.enableLoginDetails(`user${uniqueId}`, 'Password@123');
    await employeePage.saveEmployee();
  });

  test('Verify Created Employee Test', async () => {

    await employeePage.verifyEmployeeDetails(
      testData.firstName,
      testData.middleName,
      testData.lastName,
      testData.empId
    );
  });

  test('Search Employee Test', async () => {

    await employeePage.searchEmployee(
      testData.firstName,
      testData.empId
    );

    await expect(page.getByRole('cell', { name: testData.empId.toString() }))
      .toBeVisible();

    await expect(employeePage.tableBody)
      .toContainText(testData.firstName);
  });

});