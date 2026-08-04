import { test, expect } from '@playwright/test';

test('test', async ({ page,context ,browserName}) => {
    // ✅ grant permission BEFORE navigation

  const client = await page.context().newCDPSession(page);
  /*await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (2 * 1024 * 1024) / 8,
    uploadThroughput: (2 * 1024 * 1024) / 8,
    latency: 50
  });*/

  await context.grantPermissions(['geolocation'], {
    origin: 'https://untangled.cloudtesla.com'
  });

  await context.setGeolocation({
    latitude: 12.9716,
    longitude: 77.5946
  });

  await page.goto('https://untangled.cloudtesla.com/auth/login');

  let url = await page.url();
  console.log("your url is: " + url);
  await page.locator('input[name="email"]').fill('test_divya');
  await page.getByRole('textbox', { name: 'Password' }).fill('Wimate@1234');
  await page.getByRole('button', { name: 'Continue' }).click();
await page.locator('text=Loading data,please wait').waitFor({ state: 'hidden' });
//await page.locator('a:has-text("PO Master")').click();
//await page.locator('a:has-text("General Tasks")').click();
await page.waitForURL(/dashboard|home|dreamboard/);
await page.waitForLoadState('networkidle');
 // await page.locator('a:has-text("PO Master")').click();
 // await page.locator("//div[text()='Work Order']").click();
  await page.goto('https://untangled.cloudtesla.com/view-dreamboard/Forms%20Beta/General%20Tasks');
  await page.locator('text=Loading data,please wait').waitFor({ state: 'hidden' });

// wait for iframe content
const iframe = page.locator('iframe[src*="formId=General Tasks"]');
await iframe.waitFor({ state: 'visible' });

// switch using frameLocator
const frame = page.frameLocator('iframe[src*="formId=General Tasks"]');     
// wait for something inside iframe (IMPORTANT)
await frame.locator('body').waitFor();
await frame.locator('.page-loader').first().waitFor({ state: 'hidden' });

// wait for text inside iframe
await frame.getByRole('heading', { name: 'General Tasks' }).waitFor();
for (let i = 1; i <= 10; i++) {

await frame.getByRole('button', { name: 'Add' }).click();
await frame.getByRole('heading', { name: 'Add General Task' }).waitFor({ timeout: 15000 });
await expect(frame.getByRole('heading', { name: 'Add General Task' }))
  .toBeVisible();
console.log("Add General Task form is visible");
await frame.locator('.page-loader').first().waitFor({ state: 'hidden' });

// wait for input to be visible
const input = frame.locator('#text-1744022231572');

await expect(input).toBeVisible();

// wait until value is filled (if dynamic)
await expect(input).not.toHaveValue('');

// get value
const value = await input.inputValue();

console.log("Ticket ID:", value);
await frame.locator('#text-1744614665485').fill('wimate test');
await frame.locator('#text-1767772957530').fill('wimate test');
await frame.locator('#select2-single-select-1743769531063-container').click();
await frame.locator('.select2-results__option:has-text("Project Activity")').click();
await frame.locator('#textarea-1743769594860').fill('problem');

// Slow internet before submitting
await client.send('Network.emulateNetworkConditions', {
  offline: false,
  latency: 50,
  downloadThroughput: 256 * 1024, // 256 KB/s
  uploadThroughput: 256 * 1024    // 256 KB/s

});
await frame.locator('#kt_modal_add_customer_submit').click();
await frame.locator('.page-loader').first().waitFor({ state: 'hidden' });

await frame.getByRole('button', { name: 'Ok, got it!' }).click();
  console.log(`✅ Ticket ${i} created`);
}
});