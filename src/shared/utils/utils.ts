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
 * 해시 기반 색상 매핑
 * @param label
 * @returns
 */
export const getColorIndex = (label: string): number =>
  label.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % TAG_COLORS.length;
