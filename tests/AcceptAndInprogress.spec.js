import { test } from '@playwright/test';

test('Fetch and update all tickets', async ({ page, context }) => {

  //const client = await page.context().newCDPSession(page);
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
await page.waitForURL(/dashboard|home|dreamboard/);
await page.waitForLoadState('networkidle');
 // await page.locator('a:has-text("PO Master")').click();
 // await page.locator("//div[text()='Work Order']").click();
  await page.goto('https://untangled.cloudtesla.com/view-dreamboard/Forms/Work%20Order');
  await page.locator('text=Loading data,please wait').waitFor({ state: 'hidden' });

  const iframe = page.locator('iframe[src*="formId=Work Order"]');
  await iframe.waitFor({ state: 'visible' });
  const frame = page.frameLocator('iframe[src*="formId=Work Order"]');
  await frame.locator('.page-loader').first().waitFor({ state: 'hidden' });
  await frame.getByRole('heading', { name: 'Work Order' }).waitFor();
  await frame.locator('#dynamic-data').waitFor({ state: 'visible', timeout: 20000 });
  await frame.locator('#dynamic-data tr').first().waitFor({ state: 'visible', timeout: 20000 });

  const rowCount = await frame.locator('#dynamic-data tr').count();
  console.log(`Found ${rowCount} rows`);

  for (let i = 0; i < rowCount; i++) {

    if (i % 2 === 0) {
      console.log(`  ⏭️  Skipping row ${i + 1} (even index)`);
      continue;
    }

    console.log(`\nProcessing row ${i + 1} of ${rowCount}`);

    // Wait for table to be ready at start of each iteration
    await frame.locator('#dynamic-data').waitFor({ state: 'visible', timeout: 20000 });
    await frame.locator('#dynamic-data tr').first().waitFor({ state: 'visible', timeout: 20000 });

    const firstCell = frame.locator('#dynamic-data tr').nth(i).locator('td.dtr-control').first();
    await firstCell.waitFor({ state: 'visible', timeout: 10000 });
        await firstCell.scrollIntoViewIfNeeded();


    const ticketId = await firstCell.locator('span').innerText().catch(() => `Row ${i + 1}`);
    console.log(`  Ticket: ${ticketId.trim()}`);

    // ─────────────────────────────────────────
    // STEP 1: Open modal → set Accept → save
    // ─────────────────────────────────────────
    await firstCell.click();
    await frame.getByRole('heading', { name: 'Edit Work Order' }).waitFor({ state: 'visible', timeout: 15000 });
    console.log(`  Step 1: Modal opened — selecting Accept`);

    const statusDropdown = frame.locator('#select2-single-select-1732769559974-container');
    await statusDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await statusDropdown.click();

    await frame.locator('.select2-results__option').filter({ hasText: 'Accept' })
      .waitFor({ state: 'visible', timeout: 10000 });
    await frame.locator('.select2-results__option').filter({ hasText: 'Accept' }).click();

    await frame.locator('#kt_modal_add_customer_update').waitFor({ state: 'visible', timeout: 10000 });
    await frame.locator('#kt_modal_add_customer_update').click();

    await frame.getByRole('button', { name: 'Ok, got it!' }).waitFor({ state: 'visible', timeout: 15000 });
    await frame.getByRole('button', { name: 'Ok, got it!' }).click();

    // Wait for modal to close and table to re-appear
    await frame.getByRole('heading', { name: 'Edit Work Order' }).waitFor({ state: 'hidden', timeout: 15000 });
    await frame.locator('#dynamic-data').waitFor({ state: 'visible', timeout: 20000 });
    console.log(`  ✅ Step 1 done: Accept saved`);

    await page.waitForTimeout(300);

    // ─────────────────────────────────────────
    // STEP 2: Reopen same row → set In-Progress → save
    // ─────────────────────────────────────────
    await frame.locator('#dynamic-data tr').first().waitFor({ state: 'visible', timeout: 20000 });

    const firstCellStep2 = frame.locator('#dynamic-data tr').nth(i).locator('td.dtr-control').first();
    await firstCellStep2.waitFor({ state: 'visible', timeout: 10000 });
        await firstCell.scrollIntoViewIfNeeded();

    await firstCellStep2.click();

    await frame.getByRole('heading', { name: 'Edit Work Order' }).waitFor({ state: 'visible', timeout: 15000 });
    console.log(`  Step 2: Modal reopened — selecting In-Progress`);

    const statusDropdown2 = frame.locator('#select2-single-select-1732769559974-container');
    await statusDropdown2.waitFor({ state: 'visible', timeout: 10000 });
    await statusDropdown2.click();

    await frame.locator('.select2-results__option').filter({ hasText: 'In-Progress' })
      .waitFor({ state: 'visible', timeout: 10000 });
    await frame.locator('.select2-results__option').filter({ hasText: 'In-Progress' }).click();

    await frame.locator('#kt_modal_add_customer_update').waitFor({ state: 'visible', timeout: 10000 });
    await frame.locator('#kt_modal_add_customer_update').click();

    await frame.getByRole('button', { name: 'Ok, got it!' }).waitFor({ state: 'visible', timeout: 15000 });
    await frame.getByRole('button', { name: 'Ok, got it!' }).click();

    // Wait for modal to close and table to re-appear
    await frame.getByRole('heading', { name: 'Edit Work Order' }).waitFor({ state: 'hidden', timeout: 15000 });
    await frame.locator('#dynamic-data').waitFor({ state: 'visible', timeout: 20000 });
    console.log(`  ✅ Step 2 done: In-Progress saved`);

    await page.waitForTimeout(300);
  }

  console.log('\n🎉 All odd rows processed successfully!');
});