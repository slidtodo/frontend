import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

/**
 * @description
 * 단순 테스트용 스크립트입니다.
 * @see https://github.com/grafana/k6/releases k6 설치 필요
 * 해당 k6 설치 후 cmd에서 해당 레포지토리 파일로 이동후
 * k6 run perf/smoke-http.js 명령어로 실행 가능합니다.
 */
export const options = {
  vus: 1,
  iterations: 1,
};

export default function smokeTest() {
  const res = http.get(`${BASE_URL}/`);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
