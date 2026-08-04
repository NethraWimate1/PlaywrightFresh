export class DashboardPage {
  constructor(page) {
    this.page = page;

    this.reportStudioLink =
      page.getByRole('link', {
        name: 'Report Studio'
      });
  }

  async openReportStudio() {
    
    await this.reportStudioLink.click();

  }


}