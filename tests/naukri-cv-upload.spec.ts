import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const USER_CONFIG = {
  email: process.env.NAUKRI_EMAIL || 'your_email@example.com',
  password: process.env.NAUKRI_PASSWORD || 'your_password',
  cv1: process.env.CV1_NAME || 'resume1.pdf',
  cv2: process.env.CV2_NAME || 'resume2.pdf'
};

const getFlagFilePath = () => path.join(__dirname, 'upload_flag.txt');

const getFileToUpload = (): string => {
  const flagFilePath = getFlagFilePath();
  let nextFile: string;

  if (fs.existsSync(flagFilePath)) {
    const flag = fs.readFileSync(flagFilePath, 'utf-8').trim();
    if (flag === 'CV1') {
      nextFile = 'jakir_3.6yrs_exp_qa_automation.pdf';
      fs.writeFileSync(flagFilePath, 'CV2');
    } else {
      nextFile = 'Jakir_3.6yrs.Exp_QA_Automation.pdf';
      fs.writeFileSync(flagFilePath, 'CV1');
    }
  } else {
    nextFile = 'jakir_3.6yrs_exp_qa_automation.pdf';
    fs.writeFileSync(flagFilePath, 'CV2');
  }

  return path.join(__dirname, 'file', nextFile);
};

test('naukri cv upload', async ({ page }) => {
  await page.goto('https://www.naukri.com/nlogin/login');

  await expect(page).toHaveTitle("Jobseeker's Login: Search the Best Jobs available in India & Abroad - Naukri.com");
  await page.locator("#login_Layer").click();
  await page.waitForSelector("#usernameField")
  await page.locator("#usernameField").pressSequentially(USER_CONFIG.email, {delay:100})
  await page.locator("#passwordField").fill(USER_CONFIG.password)
  await page.locator("//button[text()='Login']").click()
  await page.locator("//a[text()='View']").click()

  const fileInput = await page.locator("#attachCV");
  const fileToUpload = getFileToUpload();
  await fileInput.setInputFiles(fileToUpload);
  
  await page.waitForTimeout(2000);
  await page.close();
});