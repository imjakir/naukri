import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const getFlagFilePath = () => path.join(__dirname, 'upload_flag.txt');

const getFileToUpload = (): string => {
  const flagFilePath = getFlagFilePath();
  let nextFile: string;

  if (fs.existsSync(flagFilePath)) {
    const flag = fs.readFileSync(flagFilePath, 'utf-8').trim();
    if (flag === 'CV') {
      nextFile = 'Jakir_Husain_Resume.pdf';
      fs.writeFileSync(flagFilePath, 'Resume');
    } else {
      nextFile = 'Jakir_Husain_CV.pdf';
      fs.writeFileSync(flagFilePath, 'CV');
    }
  } else {
    nextFile = 'Jakir_Husain_CV.pdf';
    fs.writeFileSync(flagFilePath, 'CV');
  }

  return path.join(__dirname, 'file', nextFile);
};

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
  const fileToUpload = getFileToUpload();
  await fileInput.setInputFiles(fileToUpload);
  
  await page.waitForTimeout(2000);
  await page.close();
});