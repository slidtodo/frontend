import { test as setup, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const authFile = path.join(__dirname, '.auth/user.json');

setup('authenticate', async ({ page }) => {
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  const email = process.env.E2E_TEST_EMAIL ?? 'test@example.com';
  const password = process.env.E2E_TEST_PASSWORD ?? 'testpassword';

  await page.goto('/login');

  await page.getByRole('textbox', { name: /이메일/i }).fill(email);
  await page.getByRole('textbox', { name: /비밀번호/i }).fill(password);
  await page.getByRole('button', { name: /로그인하기/i }).click();

  await page.waitForURL('/dashboard');
  await expect(page).toHaveURL('/dashboard');

  await page.context().storageState({ path: authFile });
});
