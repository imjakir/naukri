import { test, expect } from '@playwright/test';

test('naukri cv upload', async ({ page }) => {
  await page.goto('https://www.naukri.com/nlogin/login');

  await expect(page).toHaveTitle("Jobseeker's Login: Search the Best Jobs available in India & Abroad - Naukri.com");
  await page.locator("#login_Layer").click();
  await page.waitForSelector("#usernameField")
  await page.locator("#usernameField").pressSequentially("jakirh641@gmail.com",{delay:100})
  await page.locator("#passwordField").fill("Mother65@")
  await page.locator("//button[text()='Login']").click()
  await page.locator("//a[text()='View']").click()
  const fileInput = await page.locator("#attachCV");
  await fileInput.setInputFiles('/home/jakir/apps/naukari/tests/file/Jakir_Husain_CV.pdf');
  
  await page.waitForTimeout(2000);
  await page.close();
});


