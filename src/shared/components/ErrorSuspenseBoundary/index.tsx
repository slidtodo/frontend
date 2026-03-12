'use client';

import { Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

const IS_DEV = process.env.NODE_ENV === 'development';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-2 text-xl font-bold text-red-600">오류 발생</h2>
        <p className="mb-4 text-sm text-gray-600">
          {IS_DEV && error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'}
        </p>
        <button
          type="button"
          onClick={resetErrorBoundary}
          className="w-full rounded bg-blue-500 py-2 font-semibold text-white hover:bg-blue-600"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}

function SuspenseFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500 mx-auto"></div>
        <p className="text-gray-700">로딩 중...</p>
      </div>
    </div>
  );
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
export default function ErrorSuspenseBoundary({
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
