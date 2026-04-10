import { test, expect, Page } from '@playwright/test';

const MOCK_USER = {
  id: 1,
  nickname: '테스트유저',
  email: 'test@example.com',
  githubConnected: false,
};

const MOCK_GOAL_DETAIL = {
  id: 1,
  title: '테스트 목표',
  source: 'MANUAL',
  progress: 75,
  repositoryFullName: 'test',
  todoList: [
    {
      id: 10,
      title: '미완료 할일',
      done: false,
      favorite: false,
      source: 'manual',
      type: 'BASIC',
      goal: { id: 1, title: '테스트 목표' },
    },
    {
      id: 11,
      title: '두번째 할일',
      done: false,
      favorite: true,
      source: 'manual',
      type: 'BASIC',
      goal: { id: 1, title: '테스트 목표' },
    },
  ],
  doneList: [
    {
      id: 12,
      title: '완료된 할일',
      done: true,
      favorite: false,
      source: 'manual',
      type: 'BASIC',
      goal: { id: 1, title: '테스트 목표' },
    },
  ],
};

const MOCK_TODO_DETAIL = {
  id: 10,
  title: '미완료 할일',
  done: false,
  favorite: false,
  source: 'manual',
  type: 'BASIC',
  dueDate: '2026-12-31',
  linkUrl: null,
  imageUrl: null,
  tags: [{ id: 1, name: '태그1' }],
  noteIds: [],
  goal: { id: 1, title: '테스트 목표' },
};

async function mockGoalDetailAPIs(page: Page, goalDetail = MOCK_GOAL_DETAIL) {
  await page.route('/api/proxy/users/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_USER) }),
  );

  await page.route(/\/api\/proxy\/goals\/\d+$/, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(goalDetail) }),
  );

  await page.route(/\/api\/proxy\/goals(\?|$)/, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ goals: [{ id: 1, title: '테스트 목표', source: 'MANUAL', progress: 75 }] }),
    }),
  );

  await page.route(/\/api\/proxy\/todos\/\d+$/, (route) => {
    const url = route.request().url();
    const id = Number(url.split('/').pop());
    const all = [...(goalDetail.todoList ?? []), ...(goalDetail.doneList ?? [])];
    const found = all.find((t) => t.id === id) ?? MOCK_TODO_DETAIL;
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ...MOCK_TODO_DETAIL, ...found }),
    });
  });
}

test.describe('목표 상세 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await mockGoalDetailAPIs(page);
  });

  test('목표 제목이 표시된다', async ({ page }) => {
    await page.goto('/goal/1');

    await expect(page.getByText('테스트 목표')).toBeVisible();
  });

  test('목표 진행률이 표시된다', async ({ page }) => {
    await page.goto('/goal/1');

    await expect(page.getByText('목표진행률')).toBeVisible();
    await expect(page.getByText('75')).toBeVisible();
  });

  test('"노트 모아보기" 링크가 표시된다', async ({ page }) => {
    await page.goto('/goal/1');

    const noteLink = page.getByRole('link', { name: /노트 모아보기/ });
    await expect(noteLink).toBeVisible();
    await expect(noteLink).toHaveAttribute('href', '/goal/1/note');
  });

  test('TO DO 섹션과 DONE 섹션이 표시된다', async ({ page }) => {
    await page.goto('/goal/1');

    await expect(page.getByText('TO DO')).toBeVisible();
    await expect(page.getByText('DONE')).toBeVisible();
  });

  test('TO DO 목록에 미완료 할일이 표시된다', async ({ page }) => {
    await page.goto('/goal/1');

    await expect(page.getByText('미완료 할일')).toBeVisible();
  });

  test('DONE 목록에 완료된 할일이 표시된다', async ({ page }) => {
    await page.goto('/goal/1');

    await expect(page.getByText('완료된 할일')).toBeVisible();
  });

  test('할일이 없을 때 빈 상태 메시지가 표시된다', async ({ page }) => {
    await mockGoalDetailAPIs(page, { ...MOCK_GOAL_DETAIL, todoList: [], doneList: [] });
    await page.goto('/goal/1');

    await expect(page.getByText('할 일이 없습니다. 새로운 할 일을 추가해보세요!')).toHaveCount(2);
  });

  test('"할 일 추가" 버튼이 표시된다', async ({ page }) => {
    await page.goto('/goal/1');

    await expect(page.getByRole('button', { name: /할 일 추가/ })).toBeVisible();
  });

  test('"캘린더 보기" 버튼이 표시된다', async ({ page }) => {
    await page.goto('/goal/1');

    await expect(page.getByRole('link', { name: /캘린더 보기/ })).toBeVisible();
  });

  test('⋮ 메뉴 클릭 시 수정/삭제 드롭다운이 표시된다', async ({ page }) => {
    await page.goto('/goal/1');

    await page
      .locator('button')
      .filter({ has: page.locator('[data-lucide="ellipsis-vertical"]') })
      .first()
      .click();

    await expect(page.getByText('수정')).toBeVisible();
    await expect(page.getByText('삭제')).toBeVisible();
  });

  test('GitHub 목표는 수정 불가 표시가 뜬다', async ({ page }) => {
    await mockGoalDetailAPIs(page, {
      ...MOCK_GOAL_DETAIL,
      source: 'GITHUB',
      repositoryFullName: 'testuser/my-repo',
    });
    await page.goto('/goal/1');

    await page
      .locator('button')
      .filter({ has: page.locator('[data-lucide="ellipsis-vertical"]') })
      .first()
      .click();

    await expect(page.getByText('수정 불가')).toBeVisible();
    await expect(page.getByText('연결 해제')).toBeVisible();
  });
});

test.describe('미인증 접근', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('/goal/1 접근 시 /login으로 리다이렉트된다', async ({ page }) => {
    await page.goto('/goal/1');
    await expect(page).toHaveURL(/\/login/);
  });
});
