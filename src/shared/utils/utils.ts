import { TAG_COLORS } from '../constants/constants';

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

/**
 * API에 넘기는 날짜 포맷팅 (ISO 8601)
 * @param date
 * @returns 2026-03-06T00:00:00.000Z
 */
export const formatDateForAPI = (date: Date): string => {
  return date.toISOString();
};

/**
 * 해시 기반 색상 매핑
 * @param label
 * @returns
 */
export const getColorIndex = (label: string): number =>
  label.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % TAG_COLORS.length;
