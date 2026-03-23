/** 객체를 쿼리스트링으로 변환 (undefined, null 값 제외) */
export const toQueryString = (params?: Record<string, unknown>): string => {
  if (!params) return '';
  const entries = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => [k, String(v)]);
  return new URLSearchParams(entries).toString();
};

/**
 * fetch 공통 유틸
 * 400, 500 등 에러 응답을 throw로 변환 (fetch는 기본적으로 에러를 throw하지 않음)
 */
export const fetchJSON = async (url: string): Promise<unknown> => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
};
