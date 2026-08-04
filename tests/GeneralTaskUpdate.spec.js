import { test } from '@playwright/test';

test('Fetch and update all tickets', async ({ page, context }) => {

  const client = await page.context().newCDPSession(page);
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (4 * 1024 * 1024) / 8,
    uploadThroughput: (3 * 1024 * 1024) / 8,
    latency: 50
  });

  await context.grantPermissions(['geolocation'], {
    origin: 'https://untangled.cloudtesla.com'
  });
  await context.setGeolocation({ latitude: 12.9716, longitude: 77.5946 });

  await page.goto('https://untangled.cloudtesla.com/auth/login');
  await page.locator('input[name="email"]').fill('test_divya');
  await page.getByRole('textbox', { name: 'Password' }).fill('Wimate@1234');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.locator('text=Loading data,please wait').waitFor({ state: 'hidden' });

  await page.locator('a:has-text("PO Master")').click();
  await page.locator("//div[text()='General Tasks']").click();

  const iframe = page.locator('iframe[src*="formId=General Tasks"]');
  await iframe.waitFor({ state: 'visible' });
  const frame = page.frameLocator('iframe[src*="formId=General Tasks"]');
  await frame.locator('.page-loader').first().waitFor({ state: 'hidden' });
  await frame.getByRole('heading', { name: 'General Tasks' }).waitFor();
  await frame.locator('#dynamic-data').waitFor({ state: 'visible', timeout: 20000 });
  await frame.locator('#dynamic-data tr').first().waitFor({ state: 'visible', timeout: 20000 });

  // ✅ Helper: scroll into view + click reliably
  async function scrollAndClick(locator) {
    await locator.waitFor({ state: 'visible', timeout: 15000 });
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
  }

 async function selectOption(containerId, optionText) {
  const trigger = frame.locator(`#${containerId}`);
  await scrollAndClick(trigger);

  // Click the visible option by exact text
  await frame.getByRole('option', { name: optionText, exact: true }).click();
}

  // ✅ Helper: open a row, set status, submit, and wait for modal to close
  async function updateRowStatus(rowIndex, status) {
    await frame.locator('#dynamic-data').waitFor({ state: 'visible', timeout: 20000 });
    await frame.locator('#dynamic-data tr').first().waitFor({ state: 'visible', timeout: 20000 });

    const firstCell = frame.locator('#dynamic-data tr').nth(rowIndex).locator('td.dtr-control').first();
    await firstCell.waitFor({ state: 'visible', timeout: 10000 });
    await firstCell.scrollIntoViewIfNeeded();

    const ticketId = await firstCell.locator('span').innerText().catch(() => `Row ${rowIndex + 1}`);
    console.log(`  [${status}] Clicking: ${ticketId.trim()}`);
    await firstCell.click();

    await frame.getByRole('heading', { name: 'Edit General Tasks' }).waitFor({ state: 'visible', timeout: 15000 });
    console.log(`  Modal opened`);

    await selectOption('select2-single-select-1743769451560-container', status);

    const updateBtn = frame.locator('#kt_modal_add_customer_update');
    await scrollAndClick(updateBtn);

    const okBtn = frame.getByRole('button', { name: 'Ok, got it!' });
    await okBtn.waitFor({ state: 'visible', timeout: 15000 });
    await okBtn.scrollIntoViewIfNeeded();
    await okBtn.click();

    await frame.getByRole('heading', { name: 'Edit General Tasks' }).waitFor({ state: 'hidden', timeout: 15000 });
    await frame.locator('#dynamic-data').waitFor({ state: 'visible', timeout: 20000 });

    console.log(`  ✅ Set to "${status}": ${ticketId.trim()}`);
    await page.waitForTimeout(300);

    return ticketId.trim();
  }

  const rowCount = await frame.locator('#dynamic-data tr').count();
  console.log(`Found ${rowCount} rows`);

  for (let i = 1; i < 10; i+=2) {
    console.log(`\nProcessing row ${i + 1} of ${rowCount}`);

    // Step 1: Set to Accept
    const ticketId =     await updateRowStatus(i, 'In-Progress');


    // Step 2: Set to In Progress
    //await updateRowStatus(i, 'In Progress');

    console.log(`\n  🎯 Row ${i + 1} (${ticketId}) fully updated: Accept → In Progress`);
  }

  console.log('\n🎉 All rows processed: Accept → In Progress!');
});