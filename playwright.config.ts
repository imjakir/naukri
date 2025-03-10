import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
  testDir: './tests',
  retries: 1,
  reporter: 'line',
  use: {
    browserName: "chromium",
    trace: 'on-first-retry',
    headless: false
  },

});
