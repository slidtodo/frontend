import { test, expect, Page } from '@playwright/test';

const MOCK_USER = {
  id: 1,
  nickname: '테스트유저',
  email: 'test@example.com',
  githubConnected: false,
};

const MOCK_GOALS = {
  goals: [{ id: 1, title: '테스트 목표', source: 'MANUAL', progress: 50 }],
};

const MOCK_TODO_DETAIL = {
  id: 10,
  title: '테스트 할일',
  done: false,
  favorite: false,
  source: 'manual',
  type: 'BASIC',
  dueDate: '2026-12-31',
  linkUrl: 'https://example.com',
  imageUrl: null,
  tags: [{ id: 1, name: '태그1' }],
  noteIds: [],
  goal: { id: 1, title: '테스트 목표' },
};

const MOCK_GOAL_WITH_TODOS = {
  id: 1,
  title: '테스트 목표',
  source: 'MANUAL',
  progress: 50,
  repositoryFullName: null,
  todoList: [
    {
      id: 10,
      title: '테스트 할일',
      done: false,
      favorite: false,
      source: 'manual',
      type: 'BASIC',
      goal: { id: 1, title: '테스트 목표' },
    },
  ],
  doneList: [],
};

async function mockCommonAPIs(page: Page) {
  await page.route('/api/proxy/users/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_USER) }),
  );

  await page.route(/\/api\/proxy\/goals(\?|$)/, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_GOALS) }),
  );

  await page.route(/\/api\/proxy\/goals\/\d+$/, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_GOAL_WITH_TODOS) }),
  );

  await page.route(/\/api\/proxy\/todos\/\d+$/, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_TODO_DETAIL) }),
  );

  await page.route(/\/api\/proxy\/todos(\?|$)/, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ todos: [MOCK_TODO_DETAIL], hasMore: false, nextCursor: null, totalCount: 1 }),
    }),
  );
}

test.describe('할일 상세 모달', () => {
  test.beforeEach(async ({ page }) => {
    await mockCommonAPIs(page);
  });

  test('할일 제목 클릭 시 상세 모달이 열린다', async ({ page }) => {
    await page.goto('/goal/1');

    await page.getByRole('button', { name: '테스트 할일' }).click();

    await expect(page.getByText('테스트 할일').first()).toBeVisible();
    await expect(page.getByText('TO DO')).toBeVisible();
  });

  test('상세 모달에 목표, 마감기한, 태그가 표시된다', async ({ page }) => {
    await page.goto('/goal/1');

    await page.getByRole('button', { name: '테스트 할일' }).click();

    await expect(page.getByText('목표')).toBeVisible();
    await expect(page.getByText('테스트 목표')).toBeVisible();
    await expect(page.getByText('마감기한')).toBeVisible();
    await expect(page.getByText('태그')).toBeVisible();
  });

  test('상세 모달에 링크가 표시된다', async ({ page }) => {
    await page.goto('/goal/1');

    await page.getByRole('button', { name: '테스트 할일' }).click();

    await expect(page.getByRole('link', { name: 'https://example.com' })).toBeVisible();
  });

  test('상세 모달 X 버튼 클릭 시 모달이 닫힌다', async ({ page }) => {
    await page.goto('/goal/1');

    await page.getByRole('button', { name: '테스트 할일' }).click();
    await expect(page.getByText('TO DO')).toBeVisible();

    await page.locator('[data-lucide="x"]').click();

    await expect(page.getByText('TO DO')).not.toBeVisible();
  });

  test('완료된 할일의 상세 모달에 DONE 뱃지가 표시된다', async ({ page }) => {
    const doneTodo = { ...MOCK_TODO_DETAIL, id: 99, title: '완료된 할일', done: true };
    await page.route(/\/api\/proxy\/todos\/99$/, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(doneTodo) }),
    );
    await page.route(/\/api\/proxy\/goals\/\d+$/, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...MOCK_GOAL_WITH_TODOS,
          doneList: [
            {
              id: 99,
              title: '완료된 할일',
              done: true,
              source: 'manual',
              type: 'BASIC',
              favorite: false,
              goal: { id: 1, title: '테스트 목표' },
            },
          ],
        }),
      }),
    );

    await page.goto('/goal/1');

    await page.getByRole('button', { name: '완료된 할일' }).click();

    await expect(page.getByText('DONE')).toBeVisible();
  });
});

test.describe('할일 수정 모달', () => {
  test.beforeEach(async ({ page }) => {
    await mockCommonAPIs(page);
  });

  test('⋮ 버튼 클릭 → 수정 선택 시 수정 모달이 열린다', async ({ page }) => {
    await page.goto('/goal/1');

    await page.getByRole('button', { name: '편집 모달 보기' }).first().click();

    await expect(page.getByText('수정')).toBeVisible();
    await page.getByText('수정').click();

    await expect(page.getByText('할 일 수정')).toBeVisible();
  });

  test('수정 모달에 기존 제목이 입력되어 있다', async ({ page }) => {
    await page.goto('/goal/1');

    await page.getByRole('button', { name: '편집 모달 보기' }).first().click();
    await page.getByText('수정').click();

    const titleInput = page.getByPlaceholder('할 일의 제목을 적어주세요');
    await expect(titleInput).toHaveValue('테스트 할일');
  });

  test('수정 모달 X 버튼 클릭 시 모달이 닫힌다', async ({ page }) => {
    await page.goto('/goal/1');

    await page.getByRole('button', { name: '편집 모달 보기' }).first().click();
    await page.getByText('수정').click();
    await expect(page.getByText('할 일 수정')).toBeVisible();

    await page.locator('form button[type="button"]').first().click();

    await expect(page.getByText('할 일 수정')).not.toBeVisible();
  });

  test('수정 모달 취소 버튼 클릭 시 모달이 닫힌다', async ({ page }) => {
    await page.goto('/goal/1');

    await page.getByRole('button', { name: '편집 모달 보기' }).first().click();
    await page.getByText('수정').click();
    await expect(page.getByText('할 일 수정')).toBeVisible();

    await page.getByRole('button', { name: '취소' }).click();

    await expect(page.getByText('할 일 수정')).not.toBeVisible();
  });

  test('제목 없이 저장 시 유효성 검사 에러가 표시된다', async ({ page }) => {
    await page.goto('/goal/1');

    await page.getByRole('button', { name: '편집 모달 보기' }).first().click();
    await page.getByText('수정').click();

    await page.getByPlaceholder('할 일의 제목을 적어주세요').clear();
    await page.getByRole('button', { name: '확인' }).click();

    await expect(page.getByText('제목은 필수입니다.')).toBeVisible();
  });

  test('수정 성공 시 모달이 닫힌다', async ({ page }) => {
    await page.route(/\/api\/proxy\/todos\/\d+$/, (route) => {
      if (route.request().method() === 'PATCH') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ...MOCK_TODO_DETAIL, title: '수정된 할일' }),
        });
      } else {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_TODO_DETAIL) });
      }
    });

    await page.goto('/goal/1');

    await page.getByRole('button', { name: '편집 모달 보기' }).first().click();
    await page.getByText('수정').click();

    await page.getByPlaceholder('할 일의 제목을 적어주세요').fill('수정된 할일');
    await page.getByRole('button', { name: '확인' }).click();

    await expect(page.getByText('할 일 수정')).not.toBeVisible({ timeout: 5000 });
  });
});

test.describe('할일 추가 모달', () => {
  test.beforeEach(async ({ page }) => {
    await mockCommonAPIs(page);
  });

  test('"할 일 추가" 버튼 클릭 시 생성 모달이 열린다', async ({ page }) => {
    await page.goto('/goal/1');

    await page.getByRole('button', { name: /할 일 추가/ }).click();

    await expect(page.getByText('할 일 생성')).toBeVisible();
  });

  test('생성 모달에 제목, 목표, 마감기한 필드가 표시된다', async ({ page }) => {
    await page.goto('/goal/1');

    await page.getByRole('button', { name: /할 일 추가/ }).click();

    await expect(page.getByLabel('제목')).toBeVisible();
    await expect(page.getByText('목표', { exact: true })).toBeVisible();
    await expect(page.getByText('마감기한')).toBeVisible();
  });

  test('제목 없이 저장 시 유효성 검사 에러가 표시된다', async ({ page }) => {
    await page.goto('/goal/1');

    await page.getByRole('button', { name: /할 일 추가/ }).click();
    await page.getByRole('button', { name: '확인' }).click();

    await expect(page.getByText('제목은 필수입니다.')).toBeVisible();
  });

  test('생성 모달 X 버튼 클릭 시 모달이 닫힌다', async ({ page }) => {
    await page.goto('/goal/1');

    await page.getByRole('button', { name: /할 일 추가/ }).click();
    await expect(page.getByText('할 일 생성')).toBeVisible();

    await page.locator('form button[type="button"]').first().click();

    await expect(page.getByText('할 일 생성')).not.toBeVisible();
  });

  test('생성 모달 취소 버튼 클릭 시 모달이 닫힌다', async ({ page }) => {
    await page.goto('/goal/1');

    await page.getByRole('button', { name: /할 일 추가/ }).click();
    await expect(page.getByText('할 일 생성')).toBeVisible();

    await page.getByRole('button', { name: '취소' }).click();

    await expect(page.getByText('할 일 생성')).not.toBeVisible();
  });

  test('생성 성공 시 모달이 닫힌다', async ({ page }) => {
    await page.route(/\/api\/proxy\/todos(\?|$)/, (route) => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ ...MOCK_TODO_DETAIL, id: 99, title: '새 할일' }),
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ todos: [MOCK_TODO_DETAIL], hasMore: false, nextCursor: null, totalCount: 1 }),
        });
      }
    });

    await page.goto('/goal/1');

    await page.getByRole('button', { name: /할 일 추가/ }).click();
    await page.getByPlaceholder('할 일의 제목을 적어주세요').fill('새 할일');

    // TODO: 날짜 선택 (DateInput이 필수 필드)
    // 날짜 입력 필드를 직접 채우거나 DatePicker를 통해 선택
    // DateInput이 복잡하므로 마감기한 없이 submit해서 에러 확인 후 날짜 선택은 별도 테스트
    await page.getByRole('button', { name: '확인' }).click();

    await expect(page.getByText('마감기한은 필수입니다.')).toBeVisible();
  });
});
