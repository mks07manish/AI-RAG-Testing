import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 120000,
  fullyParallel: false,
  reporter: [
  ['list'],
  [
    './reports/rag-json-reporter.js',
    {
      outputFile: 'reports/rag-test-report.json'
    }
  ]
],
  use: { baseURL: process.env.RAG_BASE_URL || 'http://127.0.0.1:8000' }
});


