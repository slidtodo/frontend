import { test, expect, Page } from '@playwright/test';

const MOCK_USER = {
  id: 1,
  nickname: '테스트유저',
  email: 'test@example.com',
  githubConnected: false,
};

const MOCK_PROGRESS = { totalProgress: 60 };

const MOCK_GOALS_EMPTY = { goals: [] };

const MOCK_GOALS_MANUAL = {
  goals: [{ id: 1, title: '테스트 목표', source: 'MANUAL', repositoryFullName: null, progress: 50 }],
};

const MOCK_TODOS = {
  todos: [
    { id: 1, title: '첫 번째 할일', source: 'manual', isDone: false, goalId: 1 },
    { id: 2, title: '두 번째 할일', source: 'manual', isDone: true, goalId: 1 },
  ],
};

const MOCK_TODOS_EMPTY = { todos: [] };

async function mockDashboardAPIs(page: Page, overrides?: { goals?: object; todos?: object }) {
  await page.route('/api/proxy/users/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_USER) }),
  );

  await page.route('/api/proxy/users/me/progress', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_PROGRESS) }),
  );

  await page.route(/\/api\/proxy\/goals/, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(overrides?.goals ?? MOCK_GOALS_EMPTY),
    }),
  );

  await page.route(/\/api\/proxy\/todos/, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(overrides?.todos ?? MOCK_TODOS_EMPTY),
    }),
  );

  await page.route(/\/api\/proxy\/integrations\/github\/repositories/, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );

  await page.route('/api/proxy/users/me/github', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ connected: false }) }),
  );
}

test.describe('대시보드', () => {
  test.beforeEach(async ({ page }) => {
    await mockDashboardAPIs(page);
  });

  test('대시보드 기본 화면이 렌더링된다', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByText(`${MOCK_USER.nickname}님의 대시보드`)).toBeVisible();

    await expect(page.getByText('최근 등록한 할 일')).toBeVisible();

    await expect(page.getByText('내 진행 상황')).toBeVisible();

    await expect(page.getByText('TO DO 진행률')).toBeVisible();
  });

  test('모드 탭 (일반 모드 / 개발자 모드)이 표시된다', async ({ page }) => {
    await page.goto('/dashboard');

    const normalTab = page.getByRole('tab', { name: '일반 모드' });
    const devTab = page.getByRole('tab', { name: /개발자 모드/ });

    await expect(normalTab).toBeVisible();
    await expect(devTab).toBeVisible();

    await expect(normalTab).toHaveAttribute('aria-selected', 'true');
    await expect(devTab).toHaveAttribute('aria-selected', 'false');
  });

  test('할일이 없을 때 빈 상태 메시지가 표시된다', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByText('최근 등록한 할 일이 없습니다.')).toBeVisible();
  });

  test('최근 할일이 있을 때 목록이 표시된다', async ({ page }) => {
    await mockDashboardAPIs(page, { todos: MOCK_TODOS });
    await page.goto('/dashboard');

    await expect(page.getByText('첫 번째 할일')).toBeVisible();
    await expect(page.getByText('두 번째 할일')).toBeVisible();
  });

  test('"모두 보기" 클릭 시 all-todo 페이지로 이동한다', async ({ page }) => {
    await page.goto('/dashboard');

    await page.getByRole('link', { name: /모두 보기/ }).click();
    await expect(page).toHaveURL('/dashboard/all-todo');
  });

  test('목표가 없을 때 빈 상태 메시지가 표시된다', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByText('최초로 등록할 목표가 없어요.')).toBeVisible();
  });

  test('목표가 있을 때 목표 섹션이 표시된다', async ({ page }) => {
    await page.route(/\/api\/proxy\/goals/, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_GOALS_MANUAL),
      }),
    );

    await page.route(/\/api\/proxy\/goals\/\d+$/, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          title: '테스트 목표',
          source: 'MANUAL',
          progress: 50,
          todos: [],
        }),
      }),
    );

    await page.goto('/dashboard');

    await expect(page.getByText('목표 별 할일')).toBeVisible();
  });
});

test.describe('개발자 모드 모달', () => {
  test.beforeEach(async ({ page }) => {
    await mockDashboardAPIs(page, { goals: MOCK_GOALS_EMPTY });
  });

  test('개발자 모드 탭 클릭 시 GitHub 연동 모달이 열린다', async ({ page }) => {
    await page.goto('/dashboard');

    await page.getByRole('tab', { name: /개발자 모드/ }).click();

    await expect(page.getByText('개발자 모드 설정하기')).toBeVisible();
  });

  test('모달의 X 버튼 클릭 시 일반 모드로 복귀한다', async ({ page }) => {
    await page.goto('/dashboard');

    await page.getByRole('tab', { name: /개발자 모드/ }).click();
    await expect(page.getByText('개발자 모드 설정하기')).toBeVisible();

    await page
      .locator(
        'div:has(> span:text("개발자 모드 설정하기")) + div button, div:has(span:text("개발자 모드 설정하기")) button[type="button"]',
      )
      .first()
      .click();

    await expect(page.getByText('개발자 모드 설정하기')).not.toBeVisible();

    await expect(page.getByRole('tab', { name: '일반 모드' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tab', { name: /개발자 모드/ })).toHaveAttribute('aria-selected', 'false');
  });

  test('모달의 취소 버튼 클릭 시 일반 모드로 복귀한다', async ({ page }) => {
    await page.goto('/dashboard');

    await page.getByRole('tab', { name: /개발자 모드/ }).click();
    await expect(page.getByText('개발자 모드 설정하기')).toBeVisible();

    await page.getByRole('button', { name: '취소' }).click();
    await expect(page.getByText('개발자 모드 설정하기')).not.toBeVisible();

    await expect(page.getByRole('tab', { name: '일반 모드' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tab', { name: /개발자 모드/ })).toHaveAttribute('aria-selected', 'false');
  });

  test('GitHub 연동된 사용자가 개발자 모드 전환 시 레포 목록이 표시된다', async ({ page }) => {
    const githubUser = { ...MOCK_USER, githubConnected: true };

    await page.route('/api/proxy/users/me', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(githubUser) }),
    );

    await page.route(/\/api\/proxy\/integrations\/github\/repositories/, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 101, name: 'my-repo', fullName: 'testuser/my-repo' }]),
      }),
    );

    await page.goto('/dashboard');

    await page.getByRole('tab', { name: /개발자 모드/ }).click();
    await expect(page.getByText('개발자 모드 설정하기')).toBeVisible();

    await expect(page.getByText('my-repo')).toBeVisible();
    await expect(page.getByText('testuser/my-repo')).toBeVisible();
  });
});

test.describe('미인증 접근', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('/dashboard 접근 시 /login으로 리다이렉트된다', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});
