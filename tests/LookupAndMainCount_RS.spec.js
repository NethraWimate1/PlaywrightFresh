import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ReportStudioPage } from '../pages/ReportStudioPage';
import { DashboardPage } from '../pages/DashboardPage';
import MailUtil  from '../Utilities/MailUtil';
test("WebComplaint BNB Lookup and Main Count", async ({ page }) => {
    const loginPage = new LoginPage(page);
      const reportStudioPage = new ReportStudioPage(page);
      const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login(process.env.Uname,
    process.env.PASSWORD);
    dashboardPage.openReportStudio();
    await expect(page).toHaveURL(/reportStudio/); 
    await reportStudioPage.clickHamburguerMenu();
    await reportStudioPage.clickSavedQueryButton();
    await reportStudioPage.savedQueryPageValidation();
    await reportStudioPage.searchSavedQueryAndClick('WebComplaint Main Record');
    await expect(page.getByText("Loading… please enjoy this virtual cup of coffee! ☕")).toBeHidden();
    const maintablecount = await reportStudioPage.getCountOfRecords('Web Complaint');
    const WorkOrdercount = await reportStudioPage.getCountOfRecords('Work Order');
    const GT_COUNT = await reportStudioPage.getCountOfRecords('General Tasks');
    const TO_COUNT = await reportStudioPage.getCountOfRecords('Ticket Overview Form');
    const TPA_COUNT = await reportStudioPage.getCountOfRecords('Task and PPM Activity');
   // console.log("Web Complaint Main Record Count: " + maintablecount);
    await reportStudioPage.clickHamburguerMenu();
    await reportStudioPage.clickSavedQueryButton();
    await reportStudioPage.savedQueryPageValidation();
    await reportStudioPage.searchSavedQueryAndClick('WebComplaint_Yesterday_data');
    await expect(page.getByText("Loading… please enjoy this virtual cup of coffee! ☕")).toBeHidden();
    const WebComplaintlookupcount = await reportStudioPage.getCountOfRecords('Web Complaint');
        const WorkOrderlookupcount = await reportStudioPage.getCountOfRecords('Work Order');
    const GT_LOOKUPCount = await reportStudioPage.getCountOfRecords('General Tasks');
    const TO_LOOKUPCount = await reportStudioPage.getCountOfRecords('Ticket Overview Form');
        const TPA_LOOKUPCount = await reportStudioPage.getCountOfRecords('Task and PPM Activity');
        const rows = [
    {
        name: 'Web Complaint',
        content: `Main: ${maintablecount} | Lookup: ${WebComplaintlookupcount} | ${
            maintablecount === WebComplaintlookupcount ? 'No Mismatch' : 'Mismatch'
        }`
    },
    {
        name: 'Work Order',
        content: `Main: ${WorkOrdercount} | Lookup: ${WorkOrderlookupcount} | ${
            WorkOrdercount === WorkOrderlookupcount ? 'No Mismatch' : 'Mismatch'
        }`
    },
    {
        name: 'General Tasks',
        content: `Main: ${GT_COUNT} | Lookup: ${GT_LOOKUPCount} | ${
            GT_COUNT === GT_LOOKUPCount ? 'No Mismatch' : 'Mismatch'
        }`
    },
    {
        name: 'Ticket Overview Form',
        content: `Main: ${TO_COUNT} | Lookup: ${TO_LOOKUPCount} | ${
            TO_COUNT === TO_LOOKUPCount ? 'No Mismatch' : 'Mismatch'
        }`
    },
    {
        name: 'Task and PPM Activity',
        content: `Main: ${TPA_COUNT} | Lookup: ${TPA_LOOKUPCount} | ${
            TPA_COUNT === TPA_LOOKUPCount ? 'No Mismatch' : 'Mismatch'
        }`
    }
];

await MailUtil.sendReport(
    'BNB - Lookup and Main Count',
    'BNB Validation Report',
    rows
);
    expect(maintablecount).toEqual(WebComplaintlookupcount);    
    expect(WorkOrdercount).toEqual(WorkOrderlookupcount);
    expect(GT_COUNT).toEqual(GT_LOOKUPCount);
    expect(TO_COUNT).toEqual(TO_LOOKUPCount);
    expect(TPA_COUNT).toEqual(TPA_LOOKUPCount);



});
test("WebComplaint Climaveneta Lookup and Main Count", async ({ page }) => {
    const loginPage = new LoginPage(page);
      const reportStudioPage = new ReportStudioPage(page);
      const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login(process.env.UnameClimaveneta,
    process.env.PASSWORDClimaveneta);
    dashboardPage.openReportStudio();
    await expect(page).toHaveURL(/reportStudio/); 
    await reportStudioPage.clickHamburguerMenu();
    await reportStudioPage.clickSavedQueryButton();
    await reportStudioPage.savedQueryPageValidation();
    await reportStudioPage.searchSavedQueryAndClick('Web Complaint_Main');
    await expect(page.getByText("Loading… please enjoy this virtual cup of coffee! ☕")).toBeHidden();
    const maintablecount = await reportStudioPage.getCountOfRecords('Web Complaint');
    const WorkOrdercount = await reportStudioPage.getCountOfRecords('Work Order');
    const TPA_COUNT = await reportStudioPage.getCountOfRecords('Task');
   // console.log("Web Complaint Main Record Count: " + maintablecount);
    await reportStudioPage.clickHamburguerMenu();
    await reportStudioPage.clickSavedQueryButton();
    await reportStudioPage.savedQueryPageValidation();
    await reportStudioPage.searchSavedQueryAndClick('WebComplaint_Lookup');
    await expect(page.getByText("Loading… please enjoy this virtual cup of coffee! ☕")).toBeHidden();
    const WebComplaintlookupcount = await reportStudioPage.getCountOfRecords('Web Complaint');
        const WorkOrderlookupcount = await reportStudioPage.getCountOfRecords('Work Order');
        const TPA_LOOKUPCount = await reportStudioPage.getCountOfRecords('Task');
        const rows = [
    {
        name: 'Web Complaint',
        content: `Main: ${maintablecount} | Lookup: ${WebComplaintlookupcount} | ${
            maintablecount === WebComplaintlookupcount ? 'No Mismatch' : 'Mismatch'
        }`
    },
    {
        name: 'Work Order',
        content: `Main: ${WorkOrdercount} | Lookup: ${WorkOrderlookupcount} | ${
            WorkOrdercount === WorkOrderlookupcount ? 'No Mismatch' : 'Mismatch'
        }`
    },
    {
        name: 'Task',
        content: `Main: ${TPA_COUNT} | Lookup: ${TPA_LOOKUPCount} | ${
            TPA_COUNT === TPA_LOOKUPCount ? 'No Mismatch' : 'Mismatch'
        }`
    }
];

await MailUtil.sendReport(
    'Climaveneta - Lookup and Main Count',
    'Climaveneta Validation Report',
    rows
);
    expect(maintablecount).toEqual(WebComplaintlookupcount);    
    expect(WorkOrdercount).toEqual(WorkOrderlookupcount);
 
    expect(TPA_COUNT).toEqual(TPA_LOOKUPCount);
    
});
