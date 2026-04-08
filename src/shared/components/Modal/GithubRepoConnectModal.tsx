'use client';

import Image from 'next/image';
import { XIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import Button from '@/shared/components/Button';
import PageSubTitle from '@/shared/components/PageSubTitle';

import { fetchAuth } from '@/shared/lib/api';
import { useConnectGithubRepository } from '@/shared/lib/query/mutations';
import { githubQueries, goalQueries, userQueries } from '@/shared/lib/query/queryKeys';
import { useModalStore } from '@/shared/stores/useModalStore';

export default function GithubRepoConnectModal() {
  const { closeModal } = useModalStore();
  const { data: user } = useQuery(userQueries.current());
  const { data: goals } = useQuery(goalQueries.list());
  const { data: repositories } = useQuery({
    ...githubQueries.repositories(),
    enabled: user?.githubConnected ?? false,
  });

  const connectGithubRepository = useConnectGithubRepository();

  const githubGoals = goals?.goals?.filter((goal) => goal.source === 'GITHUB') ?? [];
  const connectedRepositories = new Set(githubGoals.map((goal) => goal.repositoryFullName).filter(Boolean));
  const availableRepositories = (repositories ?? []).filter(
    (repository) => !connectedRepositories.has(repository.fullName),
  );

  const handleGithubLogin = async () => {
    const response = await fetchAuth.getGithubAuthorizeUrlByEnv();
    window.location.href = response.loginUrl;
  };

  return (
    <div className="no-scrollbar flex w-full max-h-[90vh] flex-col overflow-y-auto rounded-t-[32px] bg-white p-6 shadow-[0px_0px_60px_0px_rgba(0,0,0,0.05)] md:w-[560px] md:rounded-[40px] md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <PageSubTitle
          subTitle="GitHub Repository"
          icons={<Image src={'/image/github-icon.png'} alt="GitHub Icon" width={32} height={32} />}
        />
        <button type="button" className="cursor-pointer" onClick={closeModal}>
          <XIcon size={24} className="stroke-gray-400" />
        </button>
      </div>

      {!user?.githubConnected ? (
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
        <div className="flex flex-col gap-3">
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
                onClick={() => {
                  connectGithubRepository.mutate(
                    { repositoryFullName: repository.fullName },
                    { onSuccess: closeModal },
                  );
                }}
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
