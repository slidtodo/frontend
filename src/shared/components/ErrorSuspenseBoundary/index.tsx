'use client';

import { Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { WifiOff } from 'lucide-react';

function ErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
      <WifiOff size={60} className="text-gray-400" />
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">서비스 이용이 원활하지 않아요.</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          불편을 드려 죄송해요.
          <br />
          잠시 후 다시 이용해 주세요.
        </p>
      </div>
      <button
        type="button"
        onClick={resetErrorBoundary}
        className="rounded-lg border border-gray-300 dark:border-gray-600 px-5 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        다시 시도
      </button>
    </div>
  );
}

function SuspenseFallback() {
  return <Empty>잠시만 기다려주세요...</Empty>;
}

interface ErrorSuspenseBoundaryProps {
  children: React.ReactNode;
  /**
   * @description
   * errorFallback: 오류가 발생했을 때 보여줄 컴포넌트 (기본값: ErrorFallback)
   */
  errorFallback?: React.ComponentType<FallbackProps>;
  /**
   * @description
   * suspenseFallback: Suspense가 로딩 중일 때 보여줄 컴포넌트 (기본값: SuspenseFallback)
   */
  suspenseFallback?: React.ReactNode;
  /**
   *  @description
   *  onReset: 오류가 발생한 후 "다시 시도" 버튼이 클릭되었을 때 호출되는 콜백 함수
   */
  onReset?: () => void;
  /**
   * @description
   * resetKeys: 오류 상태를 재설정할 때 사용하는 키 배열. 이 배열의 값이 변경되면 오류 상태가 초기화됩니다.
   */
  resetKeys?: unknown[];
}
export function ErrorSuspenseBoundary({
  children,
  errorFallback,
  suspenseFallback,
  onReset,
  resetKeys,
}: ErrorSuspenseBoundaryProps) {
  return (
    <ErrorBoundary FallbackComponent={errorFallback ?? ErrorFallback} onReset={onReset} resetKeys={resetKeys}>
      <Suspense fallback={suspenseFallback ?? <SuspenseFallback />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

// 리액트 쿼리와 함께 사용할 수 있는 데이터 경계 컴포넌트
export function DataBoundary({
  children,
  errorFallback,
  suspenseFallback,
  onReset,
  resetKeys,
}: ErrorSuspenseBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          FallbackComponent={errorFallback ?? ErrorFallback}
          onReset={() => {
            reset();
            onReset?.();
          }}
          resetKeys={resetKeys}
        >
          <Suspense fallback={suspenseFallback ?? <SuspenseFallback />}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
