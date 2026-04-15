import { test, expect } from '@playwright/test';
import fs from 'fs';
import { TEST_DATA_FILE } from '../constants';

let NOTE_CREATE_URL: string;
let NOTE_LIST_URL: string;

test.beforeAll(() => {
  const { goalId, todoId } = JSON.parse(fs.readFileSync(TEST_DATA_FILE, 'utf-8'));
  NOTE_CREATE_URL = `/goal/${goalId}/note/create?todoId=${todoId}`;
  NOTE_LIST_URL = `/goal/${goalId}/note`;
});

const TEST_TITLE = '[E2E] 테스트 노트';
const TEST_CONTENT = 'E2E 테스트 내용입니다.';

test.describe('노트 생성 E2E', () => {
  test('제목이 비어있으면 등록 버튼 비활성화', async ({ page }) => {
    await page.goto(NOTE_CREATE_URL);

    await expect(page.getByRole('button', { name: /등록/ })).toBeDisabled();
  });

  test('제목 30자 초과 입력 불가', async ({ page }) => {
    await page.goto(NOTE_CREATE_URL);

    const titleInput = page.getByPlaceholder('노트의 제목을 입력해주세요');
    await titleInput.fill('a'.repeat(35));

    await expect(titleInput).toHaveValue('a'.repeat(30));
  });

  test('노트 생성 → 상세 페이지 이동 → 목록 반영 확인 후 삭제', async ({ page }) => {
    // 1. 노트 생성
    await page.goto(NOTE_CREATE_URL);
    await page.getByPlaceholder('제목을 입력해주세요').fill(TEST_TITLE);
    await page.locator('.ProseMirror').click();
    await page.keyboard.type(TEST_CONTENT);
    await page.getByRole('button', { name: /등록/ }).click();

    // 2. 상세 페이지로 리다이렉트 확인 + noteId 추출
    await expect(page).toHaveURL(/\/goal\/\d+\/note\/\d+/);
    await expect(page.locator('input[readonly]')).toHaveValue(TEST_TITLE);
    const noteId = page.url().match(/\/note\/(\d+)/)?.[1];

    // 3. 노트 목록에 반영됐는지 확인
    await page.goto(NOTE_LIST_URL);
    await expect(page.locator(`a[href*="/note/${noteId}"]`)).toBeVisible();

    // 4. 생성한 노트 삭제 (테스트 데이터 정리)
    const noteItem = page.locator(`a[href*="/note/${noteId}"]`);
    await noteItem.getByRole('button').click();
    await page.getByRole('button', { name: '삭제하기' }).click();
    await page.getByRole('button', { name: '확인' }).click();

    await expect(page.locator(`a[href*="/note/${noteId}"]`)).not.toBeVisible();
  });

  test('임시저장 → 재진입 시 불러오기 토스트 표시', async ({ page }) => {
    // 1. 제목 입력 후 임시저장
    await page.goto(NOTE_CREATE_URL);
    await page.getByPlaceholder('노트의 제목을 입력해주세요').fill(TEST_TITLE);
    await page.getByRole('button', { name: '임시저장' }).click();
    await expect(page.getByText(/임시저장/)).toBeVisible();

    // 2. 페이지 재진입 시 불러오기 토스트 표시 확인
    await page.goto(NOTE_CREATE_URL);
    await expect(page.getByText(/불러오기/)).toBeVisible();
  });
});
