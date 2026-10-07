# CONTEXT — Raypick 회사 홈페이지

## 목표
raypick.co.kr을 "실제로 앱을 출시하는 회사"로 보이게 전면 리뉴얼. 설계: [docs/DESIGN.md](docs/DESIGN.md)

## 스택
Next.js 16.4 (App Router) · React 19 · TypeScript · three.js 0.186 · Pretendard(npm 내장) · Vercel 배포
(GitHub `shark7676/raypick-website` **main에 올리면 실제 사이트가 바로 바뀜**)

## 주요 결정
- 목적 = 회사 신뢰도. 앱 회사로만 (미디어 소개 제외).
- 앱: 출시 BEATRAY · Gallory · 이것좀 / 출시 예정 PARRYTHM · 하루요. 정보는 `src/data/apps.ts` 한 곳.
- 메인 = 3D 로고(A) → 스크롤하면 앱 궤도(B) → 빛이 퍼지며 밝은 화면 + 3D 휴대폰(C) → 출시 예정 → 회사 → 문의. 앱별 페이지 `/apps/[slug]`.
- 한국어 + 영어 (`src/data/translations.ts`). 문의는 admin@raypick.co.kr 메일 버튼.

## 코드 지도
- 3D: `src/lib/three/heroScene.ts`(로고+궤도), `phoneScene.ts`(휴대폰), `logoPaths.ts`(로고 도형)
- 화면: `src/components/HeroStage.tsx`, `AppShowcase.tsx`, `Upcoming.tsx`, `About.tsx`, `Contact.tsx`, `Footer.tsx`, `AppDetail.tsx`
- 이미지: `public/apps/<slug>/`, 로고 `public/brand/`

## 진행 상황
- 2026-10-08: 설계 확정 → 구현 완료 (로컬). 대표 피드백 반영: 궤도 드래그 방향 수정, 궤도선을 흐르는 빛 점선으로 교체.
- 검증: 빌드·타입·린트 통과 / 접근성·권장사항·SEO 100점 / 스토어·사이트 링크 8개 정상 / 모바일 가로 넘침 없음 / 3D 꺼진 기기 대체 화면 확인 / 실제 사이트용 부품 보안 경고 0건(Next 16.2.7→16.4.0).
- 속도(Lighthouse 모바일, 느린 4G 가정): 첫 화면 3.2~3.3초(3D 없어도 같음), 실제 빠른 인터넷 0.26초. 배포 후 PageSpeed로 재확인 필요.
- 2026-10-08: 깃허브 main에 저장(커밋 9d3b0f8) → Vercel 자동 배포 → **raypick.co.kr 반영 완료, 대표 확인.**
- 참고: main에 push하면 Vercel이 자동 배포함 (Vercel 프로젝트 `raypick`, `raypick-website` 둘 다 빌드됨).

## 다음 할 일
- [x] 깃허브 저장 + 실제 사이트 배포 (2026-10-08)
- 작업용 파일 `public/drafts/`(시안), `_assets/`(원본 자료), `로고.png`는 이 컴퓨터에만 둠 (.gitignore로 제외)
- [ ] 영어 대표 이름 표기 확인 (`Sangkwon Shin`으로 임시 표기)
- [ ] 하루요 진짜 앱 아이콘 나오면 `public/apps/haruyo/icon.webp` 교체
- [ ] 배포 후 PageSpeed Insights로 실제 속도 확인
