import { test, expect } from '@playwright/test';

test('Open local form', async ({ page }) => {
  await page.goto(
'file:///Users/nethratn/Downloads/Form%20New/Untangled-Forms/Forms/src/index.html?loginDetail=%22{\%22username\%22:\%22test_divya\%22,\%22clientID\%22:\%22testbnbclient\%22,\%22userID\%22:\%22sabrina\%22,\%22companyID\%22:\%22Testing_Climaveneta\%22,\%22name\%22:\%22sabrina\%22,\%22user_type\%22:\%22Admin\%22,\%22password\%22:\%22DUMMY\%22,\%22role\%22:\%22Admin\%22,\%22token\%22:\%22admin-token\%22,\%22permission_ID\%22:\%22All\%22,\%22form_permission\%22:[\%22All\%22],\%22location_permission\%22:[\%22All\%22,\%22World\%22,\%22Asia\%22,\%22India\%22]}%22&formId=All'
);

  await page.waitForLoadState('domcontentloaded');
  await page.getByRole('heading', { name: 'Work Order' }).waitFor();
await page.locator('#dynamic-data').waitFor({ state: 'visible', timeout: 20000 });
await page.locator('#dynamic-data tr').first().waitFor({ state: 'visible', timeout: 20000 });

const rowCount = await page.locator('#dynamic-data tr').count();
console.log(`Found ${rowCount} rows`);

for (let i = 0; i < rowCount; i++) {

  if (i % 2 === 0) {
    console.log(`⏭️ Skipping row ${i + 1} (even index)`);
    continue;
  }

  console.log(`\nProcessing row ${i + 1} of ${rowCount}`);

  // Wait for table
  await page.locator('#dynamic-data').waitFor({ state: 'visible', timeout: 20000 });
  await page.locator('#dynamic-data tr').first().waitFor({ state: 'visible', timeout: 20000 });

  const firstCell = page.locator('#dynamic-data tr').nth(i).locator('td.dtr-control').first();
  await firstCell.waitFor({ state: 'visible', timeout: 10000 });
  await firstCell.scrollIntoViewIfNeeded();

  const ticketId = await firstCell.locator('span').innerText().catch(() => `Row ${i + 1}`);
  console.log(`Ticket: ${ticketId.trim()}`);

  // ---------------- STEP 1 ----------------
  await firstCell.click();

  await page.getByRole('heading', { name: 'Edit Work Order' }).waitFor({
    state: 'visible',
    timeout: 15000
  });

  console.log('Step 1: Selecting Accept');

  const statusDropdown = page.locator('#select2-single-select-1732769559974-container');
  await statusDropdown.click();

  await page.locator('.select2-results__option')
    .filter({ hasText: 'Accept' })
    .click();

  await page.locator('#kt_modal_add_customer_update').click();

  await page.getByRole('button', { name: 'Ok, got it!' }).click();

  await page.getByRole('heading', { name: 'Edit Work Order' }).waitFor({
    state: 'hidden',
    timeout: 15000
  });

  await page.locator('#dynamic-data').waitFor({ state: 'visible' });

  console.log('✅ Accept saved');

  await page.waitForTimeout(300);

  // ---------------- STEP 2 ----------------
  const firstCellStep2 = page.locator('#dynamic-data tr').nth(i).locator('td.dtr-control').first();

  await firstCellStep2.waitFor({ state: 'visible', timeout: 10000 });
  await firstCellStep2.scrollIntoViewIfNeeded();

  await firstCellStep2.click();

  await page.getByRole('heading', { name: 'Edit Work Order' }).waitFor({
    state: 'visible',
    timeout: 15000
  });

  console.log('Step 2: Selecting In-Progress');

  const statusDropdown2 = page.locator('#select2-single-select-1732769559974-container');
  await statusDropdown2.click();

  await page.locator('.select2-results__option')
    .filter({ hasText: 'In-Progress' })
    .click();

  await page.locator('#kt_modal_add_customer_update').click();

  await page.getByRole('button', { name: 'Ok, got it!' }).click();

  await page.getByRole('heading', { name: 'Edit Work Order' }).waitFor({
    state: 'hidden',
    timeout: 15000
  });

  await page.locator('#dynamic-data').waitFor({ state: 'visible' });

  console.log('✅ In-Progress saved');

  await page.waitForTimeout(300);
}

console.log('🎉 All odd rows processed successfully!');
});