/**
 *
 * @param date
 * @returns @example 2025. 03. 17
 */
export function formatDate(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Seoul',
    })
    .replace(/\.$/, '');
}

/**
 * API에 넘기는 날짜 포맷팅 (ISO 8601)
 * @param date
 * @returns 2026-03-06T00:00:00.000Z
 */
export const formatDateForAPI = (date: Date): string => {
  return date.toISOString();
};

