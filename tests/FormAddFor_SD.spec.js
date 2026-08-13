import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { ReportStudioPage } from '../pages/ReportStudioPage.js';  


test('login', async ({ page, context }) => {
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
    process.env.TestUname,
    process.env.TestPASSWORD
  );
  
      await expect(page).toHaveTitle('Dashboard');
  const dashboardPage =new DashboardPage(page);
await dashboardPage.selectGroup("Work Order1");
await page.waitForTimeout(2000); // Wait for 2 seconds to ensure the data is loaded
//await dashboardPage.waitForIframe("Work Order1");
const formName = "Work Order1";

await dashboardPage.switchToFrame(formName);
await dashboardPage.waitForLoader();

await dashboardPage.clickAdd(formName);

// Fill form...

await dashboardPage.submit();
await dashboardPage.waitForLoader();
await dashboardPage.clickSuccessPopup();

await page.waitForTimeout(2000); // Wait for 2 seconds to ensure the data is loaded

});
