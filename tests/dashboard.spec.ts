import { test, expect, Page } from '@playwright/test';

type Todo = {
  id: number;
  title: string;
  source: string;
  isDone: boolean;
  goalId: number;
};

type GoalDetail = {
  id: number;
  title: string;
  source: string;
  progress: number;
  todoList: Todo[];
  doneList: Todo[];
};

const MOCK_USER = {
  id: 1,
  nickname: '테스트유저',
  email: 'test@example.com',
  githubConnected: false,
};

const MOCK_PROGRESS = { totalProgress: 60 };

const MOCK_GOALS_EMPTY = {
  goals: [],
};

const MOCK_GOALS_MANUAL = {
  goals: [
    {
      id: 1,
      title: '테스트 목표',
      source: 'MANUAL',
      repositoryFullName: null,
      progress: 50,
    },
  ],
};

const MOCK_TODOS = {
  todos: [
    { id: 1, title: '첫 번째 할일', source: 'manual', isDone: false, goalId: 1 },
    { id: 2, title: '두 번째 할일', source: 'manual', isDone: true, goalId: 1 },
  ],
};

const GOAL_DETAIL: GoalDetail = {
  id: 1,
  title: '테스트 목표',
  source: 'MANUAL',
  progress: 50,
  todoList: [
    { id: 1, title: '할일 1', source: 'manual', isDone: false, goalId: 1 },
    { id: 2, title: '할일 2', source: 'manual', isDone: false, goalId: 1 },
  ],
  doneList: [],
};

async function mockJson(page: Page, url: string | RegExp, body: unknown) {
  await page.route(url, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
}

async function mockBaseDashboard(page: Page) {
  await mockJson(page, '/api/proxy/users/me', MOCK_USER);
  await mockJson(page, '/api/proxy/users/me/progress', MOCK_PROGRESS);
  await mockJson(page, /\/api\/proxy\/goals$/, MOCK_GOALS_EMPTY);
  await mockJson(page, /\/api\/proxy\/todos/, { todos: [] });
  await mockJson(page, /\/api\/proxy\/integrations\/github\/repositories/, []);
  await mockJson(page, '/api/proxy/users/me/github', { connected: false });
}

async function mockGoalList(page: Page, goals = MOCK_GOALS_MANUAL) {
  await mockJson(page, /\/api\/proxy\/goals$/, goals);
}

async function mockGoalDetail(page: Page, detail = GOAL_DETAIL) {
  await mockJson(page, /\/api\/proxy\/goals\/\d+$/, detail);
}

async function mockTodoList(page: Page, todos = MOCK_TODOS) {
  await mockJson(page, /\/api\/proxy\/todos/, todos);
}

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await mockBaseDashboard(page);
  });

  test('기본 화면 렌더링', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByText('테스트유저님의 대시보드')).toBeVisible();
    await expect(page.getByText('최근 등록한 할 일')).toBeVisible();
    await expect(page.getByText('내 진행 상황')).toBeVisible();
    await expect(page.getByText('TO DO 진행률')).toBeVisible();
  });

  test('모드 탭 렌더링', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByRole('tab', { name: '일반 모드' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tab', { name: /개발자 모드/ })).toHaveAttribute('aria-selected', 'false');
  });

  test('할일 없을 때 빈 상태 표시', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByText('최근 등록한 할 일이 없습니다.')).toBeVisible();
  });

  test('최근 할일 목록 표시', async ({ page }) => {
    await mockTodoList(page);

    await page.goto('/dashboard');

    await expect(page.getByText('첫 번째 할일')).toBeVisible();
    await expect(page.getByText('두 번째 할일')).toBeVisible();
  });

  test('"모두 보기" 클릭 시 이동', async ({ page }) => {
    await page.goto('/dashboard');

    await page.getByRole('link', { name: /모두 보기/ }).click();

    await expect(page).toHaveURL('/dashboard/all-todo');
  });

  test('목표 없을 때 빈 상태 표시', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByText('최초로 등록할 목표가 없어요.')).toBeVisible();
  });

  test('목표 섹션 렌더링', async ({ page }) => {
    await mockGoalList(page);
    await mockGoalDetail(page);

    await page.goto('/dashboard');

    await expect(page.getByText('목표 별 할일')).toBeVisible();
  });
});

test.describe('Developer Mode', () => {
  test.beforeEach(async ({ page }) => {
    await mockBaseDashboard(page);
  });

  test('개발자 모드 클릭 시 모달 오픈', async ({ page }) => {
    await page.goto('/dashboard');

    await page.getByRole('tab', { name: /개발자 모드/ }).click();

    await expect(page.getByText('개발자 모드 설정하기')).toBeVisible();
  });

  test('취소 클릭 시 모달 닫힘', async ({ page }) => {
    await page.goto('/dashboard');

    await page.getByRole('tab', { name: /개발자 모드/ }).click();
    await page.getByRole('button', { name: '취소' }).click();

    await expect(page.getByText('개발자 모드 설정하기')).not.toBeVisible();
  });

  test('GitHub 연동 시 레포 표시', async ({ page }) => {
    await mockJson(page, '/api/proxy/users/me', {
      ...MOCK_USER,
      githubConnected: true,
    });

    await mockJson(page, /\/api\/proxy\/integrations\/github\/repositories/, [
      {
        id: 101,
        name: 'my-repo',
        fullName: 'testuser/my-repo',
      },
    ]);

    await page.goto('/dashboard');

    await page.getByRole('tab', { name: /개발자 모드/ }).click();

    await expect(page.getByText('my-repo')).toBeVisible();
    await expect(page.getByText('testuser/my-repo')).toBeVisible();
  });
});

test.describe('Goal Detail', () => {
  test.beforeEach(async ({ page }) => {
    await mockBaseDashboard(page);
    await mockGoalList(page);
    await mockGoalDetail(page);
  });

  test('목표 클릭 시 상세 이동', async ({ page }) => {
    await page.goto('/dashboard');

    await page.getByRole('link', { name: '테스트 목표' }).click();

    await expect(page).toHaveURL('/goal/1');
  });

  test('검색 시 필터링', async ({ page }) => {
    await page.route(/\/api\/proxy\/todos/, async (route) => {
      const url = new URL(route.request().url());
      const search = url.searchParams.get('search') || '';

      const filtered = GOAL_DETAIL.todoList.filter((todo) => todo.title.includes(search));

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          todos: filtered,
          hasMore: false,
          nextCursor: null,
        }),
      });
    });

    await page.goto('/dashboard');
    await page.getByRole('link', { name: '테스트 목표' }).click();

    await page.getByPlaceholder('할 일 검색').fill('1');

    await expect(page.getByText('할일 1')).toBeVisible();
    await expect(page.getByText('할일 2')).not.toBeVisible();
  });
});

test.describe('Todo Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await mockBaseDashboard(page);
    await mockGoalList(page);
  });

  test('할일 완료 시 진행률 업데이트', async ({ page }) => {
    let progress = 50;

    await mockGoalDetail(page, {
      ...GOAL_DETAIL,
      progress,
      doneList: [{ id: 2, title: '완료된 할일', source: 'manual', isDone: true, goalId: 1 }],
    });

    await page.route(/\/api\/proxy\/todos\/\d+$/, async (route) => {
      progress = 100;

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          title: '할일 1',
          isDone: true,
        }),
      });
    });

    await page.goto('/dashboard');
    await page.getByRole('link', { name: '테스트 목표' }).click();

    await page.getByRole('button', { name: '할일 1' }).click();

    await expect(page.getByText('100')).toBeVisible();
  });

  test('즐겨찾기 토글', async ({ page }) => {
    let favorite = false;

    await mockGoalDetail(page);

    await page.route(/\/api\/proxy\/todos\/\d+$/, async (route) => {
      favorite = !favorite;

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          favorite,
        }),
      });
    });

    await page.goto('/dashboard');
    await page.getByRole('link', { name: '테스트 목표' }).click();

    const button = page.getByRole('button', { name: '즐겨찾기' });

    await button.click();

    await expect(button).toHaveClass(/favorite/);
  });
});

test.describe('Auth Guard', () => {
  test.use({
    storageState: {
      cookies: [],
      origins: [],
    },
  });

  test('미인증 사용자는 login으로 리다이렉트', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/login/);
  });
});
