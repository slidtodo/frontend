import { test, expect, Page } from '@playwright/test';

const MOCK_USER = {
  id: 1,
  nickname: '테스트유저',
  email: 'test@example.com',
  githubConnected: false,
};

const MOCK_GOALS = {
  goals: [{ id: 1, title: '테스트 목표', source: 'MANUAL', repositoryFullName: null, progress: 50 }],
};

function makeTodoPage(todos: object[], opts: { hasMore?: boolean; nextCursor?: number; totalCount?: number } = {}) {
  return {
    todos,
    hasMore: opts.hasMore ?? false,
    nextCursor: opts.nextCursor ?? null,
    totalCount: opts.totalCount ?? todos.length,
  };
}

const MANUAL_TODOS = [
  { id: 1, title: '첫 번째 할일', source: 'manual', isDone: false, goal: { id: 1, title: '테스트 목표' } },
  { id: 2, title: '두 번째 할일', source: 'manual', isDone: false, goal: { id: 1, title: '테스트 목표' } },
  { id: 3, title: '완료된 할일', source: 'manual', isDone: true, goal: { id: 1, title: '테스트 목표' } },
];

async function mockAllTodoAPIs(page: Page, todos: object[] = MANUAL_TODOS) {
  await page.route('/api/proxy/users/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_USER) }),
  );

  await page.route(/\/api\/proxy\/goals/, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_GOALS) }),
  );

  await page.route(/\/api\/proxy\/todos/, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(makeTodoPage(todos, { totalCount: todos.length })),
    }),
  );
}

test.describe('모든 할 일 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await mockAllTodoAPIs(page);
  });

  test('페이지 제목 "모든 할 일"이 표시된다', async ({ page }) => {
    await page.goto('/dashboard/all-todo');

    await expect(page.getByText('모든 할 일')).toBeVisible();
  });

  test('필터 버튼 3개 (전체 / TO DO / DONE)가 표시된다', async ({ page }) => {
    await page.goto('/dashboard/all-todo');

    await expect(page.getByRole('button', { name: '전체' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'TO DO' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'DONE' })).toBeVisible();
  });

  test('기본 필터는 "전체"이다', async ({ page }) => {
    await page.goto('/dashboard/all-todo');

    await expect(page.getByRole('button', { name: '전체' })).toHaveClass(/text-bearlog/);
  });

  test('할일 목록이 렌더링된다', async ({ page }) => {
    await page.goto('/dashboard/all-todo');

    await expect(page.getByText('첫 번째 할일')).toBeVisible();
    await expect(page.getByText('두 번째 할일')).toBeVisible();
    await expect(page.getByText('완료된 할일')).toBeVisible();
  });

  test('할일이 없을 때 빈 상태 메시지가 표시된다', async ({ page }) => {
    await mockAllTodoAPIs(page, []);
    await page.goto('/dashboard/all-todo');

    await expect(page.getByText('등록된 할 일이 없습니다.')).toBeVisible();
  });

  test('"할 일 추가" 버튼이 표시된다', async ({ page }) => {
    await page.goto('/dashboard/all-todo');

    await expect(page.getByRole('button', { name: /할 일 추가/ })).toBeVisible();
  });

  test('Issue reopen 안내 문구가 표시된다', async ({ page }) => {
    await page.goto('/dashboard/all-todo');

    await expect(page.getByText(/Issues 완료 체크 해제 시/)).toBeVisible();
  });
});

test.describe('모든 할 일 - 필터', () => {
  test('TO DO 필터 클릭 시 done=false 파라미터로 요청한다', async ({ page }) => {
    const capturedUrls: string[] = [];

    await page.route('/api/proxy/users/me', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_USER) }),
    );
    await page.route(/\/api\/proxy\/goals/, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_GOALS) }),
    );
    await page.route(/\/api\/proxy\/todos/, (route) => {
      capturedUrls.push(route.request().url());
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(makeTodoPage(MANUAL_TODOS.filter((t) => !t.isDone))),
      });
    });

    await page.goto('/dashboard/all-todo');
    await page.getByRole('button', { name: 'TO DO' }).click();

    await expect(async () => {
      expect(capturedUrls.some((url) => url.includes('done=false'))).toBe(true);
    }).toPass({ timeout: 3000 });
  });

  test('DONE 필터 클릭 시 done=true 파라미터로 요청한다', async ({ page }) => {
    const capturedUrls: string[] = [];

    await page.route('/api/proxy/users/me', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_USER) }),
    );
    await page.route(/\/api\/proxy\/goals/, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_GOALS) }),
    );
    await page.route(/\/api\/proxy\/todos/, (route) => {
      capturedUrls.push(route.request().url());
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(makeTodoPage([MANUAL_TODOS[2]])),
      });
    });

    await page.goto('/dashboard/all-todo');
    await page.getByRole('button', { name: 'DONE' }).click();

    await expect(async () => {
      expect(capturedUrls.some((url) => url.includes('done=true'))).toBe(true);
    }).toPass({ timeout: 3000 });
  });

  test('필터 클릭 시 해당 버튼이 활성화 스타일로 바뀐다', async ({ page }) => {
    await mockAllTodoAPIs(page);
    await page.goto('/dashboard/all-todo');

    await page.getByRole('button', { name: 'DONE' }).click();

    await expect(page.getByRole('button', { name: 'DONE' })).toHaveClass(/text-bearlog/);
    await expect(page.getByRole('button', { name: '전체' })).not.toHaveClass(/text-bearlog/);
  });
});

test.describe('모든 할 일 - 무한 스크롤', () => {
  test('다음 페이지가 있을 때 스크롤 시 추가 데이터를 불러온다', async ({ page }) => {
    const page1Todos = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `할일 ${i + 1}`,
      source: 'manual',
      isDone: false,
      goal: { id: 1, title: '테스트 목표' },
    }));

    const page2Todos = Array.from({ length: 5 }, (_, i) => ({
      id: i + 11,
      title: `할일 ${i + 11}`,
      source: 'manual',
      isDone: false,
      goal: { id: 1, title: '테스트 목표' },
    }));

    await page.route('/api/proxy/users/me', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_USER) }),
    );
    await page.route(/\/api\/proxy\/goals/, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_GOALS) }),
    );
    await page.route(/\/api\/proxy\/todos/, (route) => {
      const isSecondPage = route.request().url().includes('cursor=');
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(
          isSecondPage
            ? makeTodoPage(page2Todos, { hasMore: false, totalCount: 15 })
            : makeTodoPage(page1Todos, { hasMore: true, nextCursor: 10, totalCount: 15 }),
        ),
      });
    });

    await page.goto('/dashboard/all-todo');
    await expect(page.getByText('할일 1')).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await expect(page.getByText('할일 11')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('미인증 접근', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('/dashboard/all-todo 접근 시 /login으로 리다이렉트된다', async ({ page }) => {
    await page.goto('/dashboard/all-todo');
    await expect(page).toHaveURL(/\/login/);
  });
});
