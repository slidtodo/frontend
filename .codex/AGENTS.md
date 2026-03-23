# Frontend AI Rules

## Goal

이 프로젝트는 NextJs(App) + React + TypeScript 기반 프론트엔드 프로젝트다.
기존 코드 스타일과 구조를 우선적으로 따른다.
새로운 패턴 도입보다 현재 패턴 재사용을 우선한다.

## Core Rules

- package.json 파일 보고 현재 버전을 확인한다.
- TypeScript strict를 지킨다.
- `any` 사용 금지. 불가피하면 이유를 주석으로 남긴다.
- default export 금지. named export 사용.
- 컴포넌트는 한 가지 책임만 가진다.
- props가 5개 이상 복잡해지면 분리 가능성을 먼저 검토한다. (수정하지 말고 주석을 TODO 남겨라)
- 공통 UI는 `shared/components`에 둔다.
- 도메인 로직은 feature 단위로 둔다.
- 서버 상태는 TanStack Query, 전역 클라이언트 상태는 Zustand 우선으로 하고 전역상태는 수정하지 말고 주석을 TODO 남겨라
- 폼은 React Hook Form 패턴을 우선 사용한다.
- 스타일은 테일윈드를 사용한다.
- 접근성 속성(aria, button type, label 연결)을 확인한다.

## Before Writing Code

작업 전 아래를 먼저 확인한다.

1. 같은 역할의 기존 컴포넌트가 있는지 검색
2. 같은 API 호출 패턴이 있는지 검색
3. 같은 에러 처리 방식이 있는지 검색
4. 기존 네이밍 규칙 확인

## While Editing

- 필요한 파일만 최소 수정
- 관련 없는 리팩토링 금지
- 불확실하면 새 패턴 추가보다 기존 패턴 따르기
- UI 수정 시 상태/로직 변경 범위를 명확히 유지
- 폴더 변경이나, 대규모 수정이 필요할 때는 TODO 주석을 남기고 doc 파일을 만들어 해당 파일들을 왜 수정해야하는지 설명해라

## Output Format

응답 시 아래 순서로 제안한다.

1. 변경 요약
2. 수정 파일 목록
3. 핵심 이유
4. 주의할 점
