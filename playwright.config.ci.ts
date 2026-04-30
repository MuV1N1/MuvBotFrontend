import { defineConfig, devices } from '@playwright/test';

// CI-spezifische Playwright-Config:
// - Kein webServer-Block (der Job startet den Preview-Server selbst)
// - Mehr Retries für flaky Network-Situationen in CI
// - JUnit-Report für GitLab Test-Integration
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 2,
  workers: 2,
  reporter: [
    ['list'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
