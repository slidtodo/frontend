'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

import Button from '@/shared/components/Button';
import Empty from '@/shared/components/Empty';
import PageSubTitle from '@/shared/components/PageSubTitle';
import GoalBox from '../GoalBox';

import { fetchAuth, GoalListResponse } from '@/shared/lib/api';
import { useConnectGithubRepository } from '@/shared/lib/query/mutations';
import { githubQueries, goalQueries, userQueries } from '@/shared/lib/query/queryKeys';
import { useTodoModeStore } from '@/shared/stores/useTodoModeStore';

export default function DashboardDetail() {
  const mode = useTodoModeStore((state) => state.mode);
  const { data: goals } = useQuery(goalQueries.list());
  const { data: user } = useQuery(userQueries.current());
  const { data: repositories } = useQuery({
    ...githubQueries.repositories(),
    enabled: mode === 'GITHUB' && user?.githubConnected,
  });

  const githubGoals = goals?.goals?.filter((goal) => goal.source === 'GITHUB') ?? [];
  const visibleGoals = goals?.goals?.filter((goal) => goal.source === mode) ?? [];

  if (mode === 'MANUAL' && visibleGoals.length === 0) {
    return <Empty>최초로 등록할 목표가 없어요.</Empty>;
  }

  return (
    <section className="flex flex-col gap-6">
      {mode === 'GITHUB' && (
        <GithubRepositorySection
          githubConnected={user?.githubConnected ?? false}
          connectedRepositories={new Set(githubGoals.map((goal) => goal.repositoryFullName).filter(Boolean))}
          repositories={repositories ?? []}
        />
      )}

      {visibleGoals.length === 0 ? (
        <Empty>{mode === 'GITHUB' ? '연결된 GitHub 저장소 목표가 없습니다.' : '등록된 목표가 없습니다.'}</Empty>
      ) : (
        <>
          <PageSubTitle
            subTitle={mode === 'GITHUB' ? '연결된 GitHub 목표' : '목표 별 할 일'}
            icons={<Image src={'/image/goal-todo.png'} alt="Goal Icon" width={40} height={40} />}
          />
          <div className="flex flex-col gap-[32px] pt-[10px]">
            {visibleGoals.map((goal) => (
              <GoalDetailItem key={goal.id} goal={goal} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function GoalDetailItem({ goal }: { goal: GoalListResponse['goals'][number] }) {
  const { data: goalDetail } = useQuery(goalQueries.detail(goal.id));

  if (!goalDetail) return null;

  return <GoalBox data={goalDetail} />;
}

interface GithubRepositorySectionProps {
  githubConnected: boolean;
  connectedRepositories: Set<string>;
  repositories: NonNullable<ReturnType<typeof githubQueries.repositories>['queryFn']> extends () => Promise<infer T> ? T : never;
}

function GithubRepositorySection({
  githubConnected,
  connectedRepositories,
  repositories,
}: GithubRepositorySectionProps) {
  const connectGithubRepository = useConnectGithubRepository();

  const availableRepositories = repositories.filter((repository) => !connectedRepositories.has(repository.fullName));

  const handleGithubLogin = async () => {
    const response = await fetchAuth.getGithubAuthorizeUrlByEnv();
    window.location.href = response.loginUrl;
  };

  return (
    <div className="flex flex-col gap-4 rounded-[40px] bg-white p-6 lg:px-8 lg:py-6">
      <PageSubTitle
        subTitle="GitHub Repository"
        icons={<Image src={'/image/github-icon.png'} alt="GitHub Icon" width={40} height={40} />}
      />

      {!githubConnected ? (
        <div className="flex flex-col gap-3 rounded-[24px] bg-[#F6F8FA] p-5">
          <p className="text-sm leading-6 text-gray-600">개발자 모드를 사용하려면 GitHub 로그인이 필요합니다.</p>
          <Button className="h-11 w-fit px-5" onClick={handleGithubLogin}>
            GitHub 로그인
          </Button>
        </div>
      ) : availableRepositories.length === 0 ? (
        <div className="rounded-[24px] bg-[#F6F8FA] p-5 text-sm leading-6 text-gray-600">
          연결 가능한 저장소가 없거나 이미 모두 연결되어 있습니다.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {availableRepositories.map((repository) => (
            <article
              key={repository.id}
              className="flex items-center justify-between gap-4 rounded-[24px] border border-gray-200 bg-[#F6F8FA] p-5"
            >
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-gray-800">{repository.name}</p>
                <p className="truncate text-sm text-gray-500">{repository.fullName}</p>
              </div>
              <Button
                className="h-10 shrink-0 px-4 text-sm"
                disabled={connectGithubRepository.isPending}
                onClick={() =>
                  connectGithubRepository.mutate({
                    repositoryFullName: repository.fullName,
                  })
                }
              >
                연결
              </Button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
