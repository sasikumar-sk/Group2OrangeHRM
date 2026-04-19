export class AddEmployeePage {
 constructor(page) {
this.page = page;
this.firstName = page.locator('input[name="firstName"]');
 this.lastName = page.locator('input[name="lastName"]');
this.saveBtn = page.locator('button:has-text("Save")');
this.pimBtn = page.getByRole('link', { name: 'PIM' });
this.addEmployeeBtn=page.getByRole('link', { name: 'Add Employee'})
this.username = page.getByRole('textbox').nth(5)
this.password = page.locator('input[type="password"]').first();
this.confirmPassword = page.locator('input[type="password"]').nth(1);
this.loginToggleLabel = this.page.locator('.oxd-switch-wrapper label');
}

 async enterEmployeeDetails(first, last) {
 await this.firstName.fill(first);
await this.lastName.fill(last);
 }

async clickSave() {
await this.saveBtn.click();
 }

 async enableLoginDetails() {
await this.loginToggleLabel.click();
}

async enterLoginDetails(username, password, confirmPassword) {
await this.username.fill(username);
await this.password.fill(password);
 await this.confirmPassword.fill(confirmPassword);
}
}

