/**
 *
 * @param date
 * @returns @example 2025. 03. 17
 */
export function formatDate(date: Date) {
  return date
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\.$/, '');
}
