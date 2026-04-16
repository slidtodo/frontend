'use client';

import { WifiOff } from 'lucide-react';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
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
        onClick={reset}
        className="rounded-lg border border-gray-300 dark:border-gray-600 px-5 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        다시 시도
      </button>
    </div>
  );
}
