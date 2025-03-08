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

const FILES = {
  CV1: process.env.CV1_NAME || 'default_cv1.pdf',
  CV2: process.env.CV2_NAME || 'default_cv2.pdf'
} as const;

const getUploadedFileName = async (page: any): Promise<string | null> => {
  try {
    const uploadedFileElement = await page.locator('.resume-name-inline .truncate');
    return await uploadedFileElement.getAttribute('title');
  } catch (error) {
    return null;
  }
};

const getNextFileToUpload = async (page: any): Promise<string> => {
  const currentUploadedFile = await getUploadedFileName(page);

  if (!currentUploadedFile) {
    return FILES.CV1 || 'default_cv1.pdf';
  }

  // If CV1 is uploaded, return CV2, and vice versa
  return currentUploadedFile === FILES.CV1 ? FILES.CV2 : FILES.CV1;
};

const uploadPdfFile = async (page: any, fileName: string) => {
  const fileInput = await page.locator("#attachCV");
  const fileToUpload = path.join(__dirname, 'file', fileName);

  if (!fs.existsSync(fileToUpload)) {
    throw new Error(`File not found: ${fileName}`);
  }

  await fileInput.setInputFiles(fileToUpload);
  console.log(`Uploading file: ${fileName}`);
};

test('naukri cv upload', async ({ page }) => {
  await page.goto('https://www.naukri.com/nlogin/login');

  await expect(page).toHaveTitle("Jobseeker's Login: Search the Best Jobs available in India & Abroad - Naukri.com");
  await page.locator("#login_Layer").click();
  await page.waitForSelector("#usernameField");
  await page.locator("#usernameField").pressSequentially(USER_CONFIG.email, { delay: 100 });
  await page.locator("#passwordField").fill(USER_CONFIG.password);
  await page.locator("//button[text()='Login']").click();
  await page.locator("//a[text()='View']").click();

  // Get and upload the next file
  const fileToUpload = await getNextFileToUpload(page);
  await uploadPdfFile(page, fileToUpload);
  await page.waitForTimeout(2000);

  const careerProfileEditButton = page.locator("//span[text()='Career profile']/following-sibling::span");
  const selectedLocationCrossButton = page.locator("//a[.='Cross']")
  const saveButton = page.locator("#saveDesiredProfile")
  const preferredWorkLocationInputField = page.locator("#locationSugg")
  const quickLinkCareerProfile = page.locator("//div[@class='card quickLink sticky']//span[.='Career profile']")
  const worklocationText = page.locator("//span[normalize-space()='Preferred work location (Max 10)']")

  // Click career profile edit button and wait for the form to be visible
  await page.mouse.wheel(0, 500)
  await quickLinkCareerProfile.click();
  await careerProfileEditButton.click();
  await preferredWorkLocationInputField.waitFor({ state: 'visible' });

  // Remove existing locations
  while (await selectedLocationCrossButton.count() > 0) {
    await selectedLocationCrossButton.first().click();
  }

  //click on preferredWorkLocationInputField
  // await preferredWorkLocationInputField.click({ delay: 100 })
  // await preferredWorkLocationInputField.pressSequentially("bhubaneswar", { delay: 100 });
  // await page.keyboard.press('ArrowDown');
  // await page.keyboard.press('ArrowDown');
  // await page.keyboard.press('Enter');
  await preferredWorkLocationInputField.click({ delay: 100 })
  // Add new locations
  const textsToCheck = ["Remote", "Pune", "Kolkata", "Bengaluru", "Hyderabad",];

  for (const text of textsToCheck) {
    const element = page.locator('li.sugTouple.UnChecked', { hasText: text });

    if (await element.count() > 0) {
      console.log(`✅ '${text}' exists.`);
      await element.click(); // Click if found
    } else {
      console.log(`❌ '${text}' is missing.`);
    }
  }

  // Save the changes and wait for success indication
  await worklocationText.click()
  await saveButton.click();

  await page.close();
});
