export class DashboardPage {
  constructor(page) {
    this.page = page;


    this.reportStudioLink =
      page.getByRole('link', {
        name: 'Report Studio'
      });
      this.clickDashBoardCard = page.getByRole('button', { name: 'Dashboard Card' });
  }

  async openReportStudio() {
    
    await this.reportStudioLink.click();

  }
async selectGroup(groupName) {
    const groupCard = this.page.locator('.card-body').filter({
        has: this.page.getByText(groupName, { exact: true })
    });

    await groupCard.click();
}


    async switchToFrame(formName) {
        this.frame = this.page.frameLocator(`iframe[src*="formId=${formName}"]`);

        await this.page
            .locator(`iframe[src*="formId=${formName}"]`)
            .waitFor({ state: "visible" });

        await this.frame.locator("body").waitFor();
    }
    
    async waitForLoader() {
        await this.frame.locator(".page-loader").first().waitFor({
            state: "hidden",
        });
    }
    async clickAdd(formName) {
        await this.frame.getByRole("button", { name: "Add" }).click();
        await this.frame
            .getByRole("heading", { name: `Add ${formName}` })
            .waitFor();
    }
     async submit() {
        await this.frame.locator("#kt_modal_add_customer_submit").click();
    }

    // Success popup
    async clickSuccessPopup() {
        await this.frame.getByRole("button", { name: "Ok, got it!" }).click();
    }
  
   


}