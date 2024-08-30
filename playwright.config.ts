import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
  testDir: './tests',

  reporter: 'line',
  use: {
    browserName: "chromium",
    trace: 'on-first-retry',
    headless: false
  },

});
