type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

interface PageHeaderProps {
  id?: string;
  title: string;
  count?: number;
  /** Semantic HTML element — 페이지에 따라 h1, h2, h3, h4 중 결정 */
  as?: HeadingLevel;
  className?: string;
}

/**
 * Dashboard / 페이지 헤더 + 카운트 넘버(ex. 찜한 할 일 개수)
 *
 * ## 반응형 폰트 크기
 * | 뷰포트       | 폰트 크기 | Tailwind 클래스  |
 * |-------------|---------|-----------------|
 * | 375px ~     | 16px    | `text-base`     |
 * | 744px ~     | 20px    | `md:text-xl`  |
 * | 1920px ~    | 24px    | `lg:text-2xl` |
 *
 * ## 색상
 * - 제목: `text-slate-700`
 * - 카운트: `text-orange-600`
 *
 * ## 사용 예시
 * ```tsx
 * // node 13460:51819 — 대시보드 타이틀
 * <SectionHeading as="h1" title="체다치즈님의 대시보드" />
 *
 * // node 13460:53740 — 페이지 헤더 + 카운트
 * <SectionHeading as="h2" title="모든 할 일" count={10} />
 *
 * // node 13460:61446 — 페이지 헤더 + 카운트
 * <SectionHeading as="h2" title="찜한 할 일" count={6} />
 * ```
 */
export function PageHeader({ id, title, count, as: Tag = 'h2', className = '' }: PageHeaderProps) {
  const hasCount = count !== undefined;

  return (
    <Tag
      id={id}
      className={[
        'flex items-center gap-2',
        'font-semibold tracking-[-0.03em]',
        // 반응형 폰트 크기: 375px → 16px / 744px → 20px / 1920px → 24px lg -> 10xxpx
        'text-base leading-6',
        'md:text-xl md:leading-7.5',
        '2xl:text-2xl 2xl:leading-8',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      // count가 있을 때 스크린 리더가 "모든 할 일, 10개"로 읽도록 aria-label 구성
      aria-label={hasCount ? `${title}, ${count}개` : undefined}
    >
      {/* 제목 — slate-700 */}
      <span className="text-slate-700">{title}</span>

      {/* 카운트 — orange-600, aria-label로 이미 읽히므로 aria-hidden 처리 */}
      {hasCount && (
        <span className="text-orange-600" aria-hidden="true">
          {count}
        </span>
      )}
    </Tag>
  );
}

export default PageHeader;
