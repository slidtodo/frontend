import { test, expect, Page } from '@playwright/test';

const MOCK_USER = {
  id: 1,
  nickname: '테스트유저',
  email: 'test@example.com',
  githubConnected: false,
};

const MOCK_GOALS = {
  goals: [
    { id: 1, title: '목표 A', source: 'MANUAL', progress: 30 },
    { id: 2, title: '목표 B', source: 'MANUAL', progress: 60 },
  ],
};

const MOCK_FAVORITE_TODO = {
  id: 11,
  title: '즐겨찾기 할일',
  done: false,
  favorite: true,
  source: 'manual',
  type: 'BASIC',
  dueDate: '2026-12-31',
  linkUrl: null,
  imageUrl: null,
  tags: [],
  noteIds: [],
  goal: { id: 1, title: '목표 A' },
};

const MOCK_FAVORITE_TODOS_PAGE = {
  todos: [MOCK_FAVORITE_TODO],
  hasMore: false,
  nextCursor: null,
  totalCount: 1,
};

async function mockFavoriteTodoAPIs(page: Page, todosResponse = MOCK_FAVORITE_TODOS_PAGE) {
  await page.route('/api/proxy/users/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_USER) }),
  );

  await page.route(/\/api\/proxy\/goals(\?|$)/, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_GOALS) }),
  );

  await page.route(/\/api\/proxy\/todos(\?|$)/, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(todosResponse) }),
  );

  await page.route(/\/api\/proxy\/todos\/\d+$/, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_FAVORITE_TODO) }),
  );
}

test.describe('찜한 할일 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await mockFavoriteTodoAPIs(page);
  });

  test('"찜한 할일" 페이지 제목이 표시된다', async ({ page }) => {
    await page.goto('/dashboard/favorite-todo');

    await expect(page.getByText('찜한 할일')).toBeVisible();
  });

  test('ALL / TO DO / DONE 필터 버튼이 표시된다', async ({ page }) => {
    await page.goto('/dashboard/favorite-todo');

    await expect(page.getByRole('button', { name: 'ALL' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'TO DO' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'DONE' })).toBeVisible();
  });

  test('목표 드롭다운 필터가 표시된다', async ({ page }) => {
    await page.goto('/dashboard/favorite-todo');

    await expect(page.getByRole('combobox')).toBeVisible();
  });

  test('즐겨찾기 할일 목록이 표시된다', async ({ page }) => {
    await page.goto('/dashboard/favorite-todo');

    await expect(page.getByText('즐겨찾기 할일')).toBeVisible();
  });

  test('할일 카드에 즐겨찾기 아이콘이 채워진 상태로 표시된다', async ({ page }) => {
    await page.goto('/dashboard/favorite-todo');

    const favBtn = page.getByRole('button', { name: '즐겨찾기 해제' });
    await expect(favBtn).toBeVisible();
    await expect(favBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('즐겨찾기 없을 때 빈 상태 메시지가 표시된다', async ({ page }) => {
    await mockFavoriteTodoAPIs(page, { todos: [], hasMore: false, nextCursor: null, totalCount: 0 });
    await page.goto('/dashboard/favorite-todo');

    await expect(page.getByText('즐겨찾기한 할 일이 없습니다.')).toBeVisible();
  });

  test('ALL 필터가 기본으로 활성화되어 있다', async ({ page }) => {
    await page.goto('/dashboard/favorite-todo');

    const allBtn = page.getByRole('button', { name: 'ALL' });
    await expect(allBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('TO DO 필터 클릭 시 활성화된다', async ({ page }) => {
    await page.goto('/dashboard/favorite-todo');

    await page.getByRole('button', { name: 'TO DO' }).click();

    await expect(page.getByRole('button', { name: 'TO DO' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('button', { name: 'ALL' })).toHaveAttribute('aria-pressed', 'false');
  });

  test('DONE 필터 클릭 시 활성화된다', async ({ page }) => {
    await page.goto('/dashboard/favorite-todo');

    await page.getByRole('button', { name: 'DONE' }).click();

    await expect(page.getByRole('button', { name: 'DONE' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('button', { name: 'ALL' })).toHaveAttribute('aria-pressed', 'false');
  });

  test('목표 드롭다운에서 목표 선택 시 필터가 적용된다', async ({ page }) => {
    let filteredGoalId: string | null = null;

    await page.route(/\/api\/proxy\/todos(\?|$)/, (route) => {
      const url = new URL(route.request().url());
      filteredGoalId = url.searchParams.get('goalId');
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(filteredGoalId ? MOCK_FAVORITE_TODOS_PAGE : MOCK_FAVORITE_TODOS_PAGE),
      });
    });

    await page.goto('/dashboard/favorite-todo');

    const combobox = page.getByRole('combobox');
    await combobox.click();

    await page.getByRole('option', { name: '목표 A' }).click();

    await expect(combobox).toHaveValue('목표 A');
  });

  test('무한 스크롤 — 다음 페이지 데이터를 불러온다', async ({ page }) => {
    const page1Todos = Array.from({ length: 15 }, (_, i) => ({
      ...MOCK_FAVORITE_TODO,
      id: 100 + i,
      title: `즐겨찾기 할일 ${i + 1}`,
    }));
    const page2Todos = [{ ...MOCK_FAVORITE_TODO, id: 200, title: '두번째 페이지 할일' }];

    let requestCount = 0;
    await page.route(/\/api\/proxy\/todos(\?|$)/, (route) => {
      requestCount++;
      if (requestCount === 1) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ todos: page1Todos, hasMore: true, nextCursor: 'cursor_abc', totalCount: 16 }),
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ todos: page2Todos, hasMore: false, nextCursor: null, totalCount: 16 }),
        });
      }
    });

    await page.goto('/dashboard/favorite-todo');

    await expect(page.getByText('즐겨찾기 할일 1')).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await expect(page.getByText('두번째 페이지 할일')).toBeVisible({ timeout: 5000 });
  });

  test('할일 제목 클릭 시 상세 모달이 열린다', async ({ page }) => {
    await page.goto('/dashboard/favorite-todo');

    await page.getByRole('button', { name: '즐겨찾기 할일' }).click();

    await expect(page.getByText('TO DO')).toBeVisible();
  });
});

test.describe('미인증 접근', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('/dashboard/favorite-todo 접근 시 /login으로 리다이렉트된다', async ({ page }) => {
    await page.goto('/dashboard/favorite-todo');
    await expect(page).toHaveURL(/\/login/);
  });
});
