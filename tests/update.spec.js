import { test, expect } from '@playwright/test';
test('test', async ({ page,context }) => {
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
//await page.locator('a:has-text("Create Ticket")').click();
await page.waitForURL(/dashboard|home|dreamboard/);
await page.waitForLoadState('networkidle');
 // await page.locator('a:has-text("PO Master")').click();
 // await page.locator("//div[text()='Work Order']").click();
  await page.goto('https://untangled.cloudtesla.com/view-dreamboard/Forms%20V4/Web%20Complaint');
  await page.locator('text=Loading data,please wait').waitFor({ state: 'hidden' });
// wait for iframe content
const iframe = page.locator('iframe[src*="formId=Web Complaint"]');
await iframe.waitFor({ state: 'visible' });

// switch using frameLocator
const frame = page.frameLocator('iframe[src*="formId=Web Complaint"]');

// wait for something inside iframe (IMPORTANT)
await frame.locator('body').waitFor();
await frame.locator('.page-loader').first().waitFor({ state: 'hidden' });

// wait for text inside iframe
await frame.getByRole('heading', { name: 'Web Complaint' }).waitFor();
for (let i = 1; i <= 10; i++) {

  console.log(`🚀 Creating Ticket #${i}`);
await frame.getByRole('button', { name: 'Add' }).click();
await expect(frame.getByRole('heading', { name: 'Add Web Complaint' }))
  .toBeVisible();console.log("Add Web Complaint form is visible");
// wait for input to be visible
const input = frame.locator('#prefix-prefix-prefix-prefix_sufix-prefix_sufix-text-1733738116242');
await expect(input).toBeVisible();
// wait until value is filled (if dynamic)
await expect(input).not.toHaveValue('');
// get value
const value = await input.inputValue();
console.log("Ticket ID:", value);
await frame.locator('#select2-single-select-1733914399220-container').click();
await frame.locator('.select2-results__option:has-text("SAP India Pvt Ltd")').click();
// Location dropdown
await frame.locator('#select2-single-select-1733738657772-container').click();
await frame.locator('.select2-results__option:has-text("Airoha Noida")').click();
// PO Number dropdown
await frame.locator('#select2-single-select-1733738657779-container').click();
await frame.locator('.select2-results__option').filter({ hasText: /^2200007445$/ }).click();// System Name dropdown
await frame.locator('#select2-single-select-1733989073754-container').click();
await frame.locator('.select2-results__option:has-text("Addressable Fire Alarm System")').click();
// Problem List dropdown
await frame.locator('#select2-single-select-1733739137287-container').click();
await frame.locator('.select2-results__option:has-text("Device malfunctions")').click();
// Repeat Complaint dropdown
await frame.locator('#select2-single-select-1732858580036-container').click();
await frame.locator('.select2-results__option:has-text("Yes")').click();
await frame.locator('#textarea-1733739590030').fill('problem test');
//await page.pause();   //  browser will NOT close
await frame.locator('.page-loader').first().waitFor({ state: 'hidden' });
console.log("Submit enabled:", await frame.locator('#kt_modal_add_customer_submit').isEnabled());
console.log("Loader visible:", await frame.locator('.page-loader').isVisible());
await page.screenshot({ path: `submit-${i}.png`, fullPage: true });
await frame.locator('#kt_modal_add_customer_submit').click();
await frame.locator('.page-loader').first().waitFor({ state: 'hidden' });
await frame.getByRole('button', { name: 'Ok, got it!' }).click();
  console.log(`✅ Ticket ${i} created`);
}
});