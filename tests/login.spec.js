import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { ReportStudioPage } from '../pages/ReportStudioPage.js';  
import ExcelUtility from '../Utilities/ExcelUtility.js';  
import Comparison from '../Utilities/Comparison.js'; 
import MailUtil from '../Utilities/MailUtil.js'; 
import ReportUtil from '../Utilities/ReportUtil.js';

test('Login', async ({ page, context }) => {
  const loginPage = new LoginPage(page);
  await context.grantPermissions(['geolocation'], {
    origin: 'https://untangled.cloudtesla.com'
  });
  await context.setGeolocation({
    latitude: 12.9716,
    longitude: 77.5946
  });
  await loginPage.navigate();
  await loginPage.login(
    process.env.Uname,
    process.env.PASSWORD
  );
  await expect(page).toHaveTitle('Dashboard');
  const dashboardPage =new DashboardPage(page);
  await dashboardPage.openReportStudio();
  const reportStudioPage = new ReportStudioPage(page);

  //await reportStudioPage.clickSelectForm();
  await expect(page).toHaveURL(/reportStudio/); 
  await reportStudioPage.clickHamburguerMenu();
  await reportStudioPage.clickSavedQueryButton();
  await reportStudioPage.savedQueryPageValidation();
  await reportStudioPage.searchSavedQueryAndClick('TestTickets');
  await reportStudioPage.selectDate('2026-07-02');
  await reportStudioPage.clickApplyButton();
  await expect(page.getByText("Loading… please enjoy this virtual cup of coffee! ☕")).toBeHidden();
  await page.waitForTimeout(8000); // Wait for 5 seconds to ensure the data is loaded
  await reportStudioPage.clickExportButton();
const filePath = await reportStudioPage.clickExportExcelButton();

// Read the sheets
const overview = await ExcelUtility.readExcelFile(
    filePath,
    "Ticket Overview Form",
    "Ticket ID",
    "Ticket Status"
);

const generalTask = await ExcelUtility.readExcelFile(
    filePath,
    "General Tasks",
    "Ticket ID",
    "Ticket Status"
);

const workOrder = await ExcelUtility.readExcelFile(
    filePath,
    "Work Order",
    "Work Order ID",
    "Status"
);

// Compare
const missingGT = Comparison.findMissingRecords(
    overview,
    generalTask,
    "General Tasks"
);

const mismatchGT = Comparison.findStatusMismatch(
    overview,
    generalTask,
    "General Tasks"
);

if (mismatchGT.length > 0) {

    console.log("===== General Task Mismatches =====");

    mismatchGT.forEach(item => {

        console.log(
            `Ticket ID : ${item.ticketId}
Sheet      : ${item.sheet}
Overview   : ${item.ticketOverviewStatus}
Actual     : ${item.actualStatus}
Reason     : ${item.reason}
--------------------------------`
        );

    });

}

const missingWO = Comparison.findMissingRecords(
    overview,
    workOrder,
    "Work Order"
);

const mismatchWO = Comparison.findStatusMismatch(
    overview,
    workOrder,
    "Work Order"
);
if (mismatchWO.length > 0) {

    console.log("===== Work Order Mismatches =====");

    mismatchWO.forEach(item => {

        console.log(
            `Ticket ID : ${item.ticketId}
Sheet      : ${item.sheet}
Overview   : ${item.ticketOverviewStatus}
Actual     : ${item.actualStatus}
Reason     : ${item.reason}
--------------------------------`
        );

    });

}
// Print results
console.log("Missing GT:", missingGT.length);
console.log("Mismatch GT:", mismatchGT.length);
console.log("Missing WO:", missingWO.length);
console.log("Mismatch WO:", mismatchWO.length);

await MailUtil.sendReport(
    missingGT,
    mismatchGT,
    missingWO,
    mismatchWO
);
});