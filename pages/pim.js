class PimPage {
  constructor(page) {
    this.page = page;

    // PIM Menu
    this.pimMenu = page.getByRole('link', { name: 'PIM' })

    // Add Employee
    this.addEmployeeBtn = page.getByRole('button', { name: 'Add' })

    this.firstName = page.locator('input[name="firstName"]')
    this.lastName = page.locator('input[name="lastName"]')

    this.employeeId = page.locator('input').nth(4)

    // Toggle login details
this.createLoginToggle = page.locator('span.oxd-switch-input.oxd-switch-input--active.--label-right')



    this.username = page.locator("//body/div[@id='app']/div[@class='oxd-layout orangehrm-upgrade-layout']/div[@class='oxd-layout-container']/div[@class='oxd-layout-context']/div[@class='orangehrm-background-container']/div[@class='orangehrm-card-container']/form[@class='oxd-form']/div[@class='orangehrm-employee-container']/div[@class='orangehrm-employee-form']/div[@class='oxd-form-row']/div[1]/div[1]/div[1]/div[2]/input[1]")
    this.password = page.locator('input[type="password"]').first()
    this.confirmPassword = page.locator('input[type="password"]').nth(1)

    this.saveBtn =  page.getByRole('button', { name: 'Save' })

    
  }

  async navigateToPIM() {
    await this.pimMenu.click();
  }

  async createEmployee(firstName, lastName, username, password, employeeId) {
    await this.pimMenu.click()
    await this.addEmployeeBtn.click()

    await this.firstName.fill(firstName)
    await this.lastName.fill(lastName)

    // Toggle login details
    await this.createLoginToggle.click()

    await this.username.fill(username)
    await this.password.fill(password)
    await this.confirmPassword.fill(password)

    await this.saveBtn.click()
  }
}

export { PimPage };