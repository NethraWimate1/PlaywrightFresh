import path from 'path';

export class ReportStudioPage {
  constructor(page) {
    this.page = page;
    this.selectFormDropdown = page.locator("//div[contains(text(),'Select Form')]");    
    this.hamburguerMenu = page.locator("label[for='myMenu-open']");
    this.searchbox=page.locator("role=searchbox[name='searchbox']");
    this.savedQueryButton=page.getByTitle("Search Saved Query");
    this.savedQueryPageTitle=page.locator("text=Saved Query Table");
    this.searchSavedQuery=page.locator("input[type='search']");
    this.dateField=page.locator("input[formcontrolname='singleDate']");
    this.ApplyButton=page.locator("button:has-text('Apply')");
    this.exportButton = page.getByRole('button', { name: 'Export' });
    this.exportExcelButton = page.getByRole('menuitem', { name: 'Export as Excel' });

  }

  async clickHamburguerMenu() {
    await this.hamburguerMenu.click();
  }
  async clickSelectForm() {
    await this.selectFormDropdown.click();
  }
  async clickSavedQueryButton() {
    await this.savedQueryButton.click();
  }

  async searchForm(formName) {
    await this.searchbox.fill(formName);
  }

  async savedQueryPageValidation() {
    await this.savedQueryPageTitle.waitFor({ state: 'visible' });
  }

  async searchSavedQueryAndClick(queryName) {
    await this.searchSavedQuery.fill(queryName);
    await this.page.getByRole('link', { name: queryName }).click();
  }
  async selectDate(date) {
    await this.dateField.fill(date);
  }
  async clickApplyButton() {
    await this.ApplyButton.click();
  }

  async clickExportButton() {
    await this.exportButton.click();
  }
  /*async clickExportExcelButton() {
    const download = await this.page.waitForEvent('download');

    await this.exportExcelButton.click();
    await download.saveAs('downloads/Report.xlsx');
  }*/

 async clickExportExcelButton() {
    const downloadPromise = this.page.waitForEvent('download');

    await this.exportExcelButton.click();

    const download = await downloadPromise;

    const filePath = path.join(
        process.cwd(),
        'downloads',
        download.suggestedFilename()
    );

    await download.saveAs(filePath);

    return filePath;

}
async getCountOfRecords(Form) {
   //return await this.page.locator("//h3[contains(text(),'"+Form+"')]/following::span[@data-ref='lbRecordCount']").textContent();
   return await this.page
        .locator("//h3[contains(.,'" + Form + "')]/following::ag-grid-angular[1]//span[@data-ref='lbRecordCount']")
        .textContent();
}
  

}