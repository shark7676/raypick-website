# CONTEXT — Raypick 회사 홈페이지

> 이 파일은 "지금까지의 핵심 기억"이다. 대화가 길어지거나 새로 시작해도 이 파일만 읽으면 이어서 일할 수 있다.
> 설계·결정 이유 전체: [docs/DESIGN.md](docs/DESIGN.md) · 작업 내역·사용법: [CHANGELOG.md](CHANGELOG.md)

**마지막 갱신:** 2026-10-26

## 🎯 목표
raypick.co.kr을 "실제로 앱을 출시하는 회사"로 보이게 하는 회사 홈페이지 (목적 = 회사 신뢰도, 앱 회사로만).

## 🧱 스택
Next.js 16.4.3 (App Router) · React 19 · TypeScript · three.js 0.186 · Pretendard(npm 내장) · Vercel
- GitHub `shark7676/raypick-website` **main에 push하면 Vercel이 바로 실제 사이트에 배포** (Vercel 프로젝트 `raypick`, `raypick-website` 둘 다 빌드됨)
- 로컬 폴더 `D:\project\Raypick Office` · 미리보기 `npm run dev` → http://localhost:3000

## 🗺️ 코드 지도
- 앱 정보 한 곳: `src/data/apps.ts` (status: `live` 출시 · `updating` 스토어에서 잠시 내려감 · `coming` 출시 예정)
- 문구(한·영): `src/data/translations.ts` — `|`는 휴대폰 줄바꿈 묶음 표시, `\n`은 줄바꿈 (`<Phrases>`)
- 3D: `src/lib/three/heroScene.ts`(로고+앱 궤도), `phoneScene.ts`(3D 휴대폰), `logoPaths.ts`(로고 도형)
- 화면: `src/components/` HeroStage · AppShowcase · Upcoming · About · Contact · Footer · AppDetail
- 이미지: `public/apps/<slug>/`, 로고 `public/brand/`

## ✅ 지금까지 한 일
- 2026-10-08 전면 리뉴얼 설계·구현·배포: 3D 로고(A) → 앱 궤도(B) → 새벽빛 → 밝은 스튜디오 3D 휴대폰(C) → 곧 만나요 → 회사 → 문의, 앱별 페이지 `/apps/[slug]`, 한·영 전환. 로고를 SVG로 다시 그림(원본 일치 97.7%).
- 2026-10-08 다듬기: 로고 누르면 맨 위로, 세로 태블릿 배치, 흰 섬광 → 새벽빛 전환.
- 2026-10-10 다듬기: 휴대폰 로고 크게·아이콘은 로고보다 작게, 앞쪽 아이콘 선명(빛 번짐 뒤에 따로 그림)+네온 테두리·반사 빛, 줄바꿈 정리(6페이지 한·영 검사 0곳), 궤도 문구 "하나의 스튜디오, 계속 늘어나는 세계.", 안내 문구 삭제, 로고 테두리 흰 점선 제거(MSAA), 휴대폰 궤도 멈춤 수정(pointercancel 처리)·회전 2배.
- 2026-10-26 PARRYTHM 출시 반영(구글 10/13·애플 10/26): 출시 앱으로 이동, 스토어 버튼 2개, 실제 게임 화면·공식 아이콘·스토어 문구. 이것좀 → `updating`. 회사 영문명 Raypick Co., Ltd. 통일. 공유 이미지·검색 설명 갱신. Next 16.4.0 → 16.4.3(심각 보안 경고 해결).
- 2026-10-26 Gallory 1.2 새 디자인 반영(먹색·금박): 3D 휴대폰 화면 4장·앱 페이지 스크린샷 4장 교체, 대표 색 금박 #E7C677, 폰 테두리 #3A302A. 아이콘·소개 문구는 1.2에서도 그대로. ※ 1.2는 아직 스토어 제출 전(스토어는 1.1), gallory.app 사이트는 1.2 공개.
- 모든 변경 배포 완료 — 실제 사이트에서 확인.
- 검증 기준(설계 문서 6절): 휴대폰 첫 화면 2.6~2.8초(느린 4G 가정) · 접근성·SEO 100점 · 가로 넘침 없음 · 3D 꺼진 기기 대체 화면 · 실제 사이트용 부품 보안 경고 0건.

## 🧭 주요 결정 (왜 그렇게 했나)
- 앱 회사로만, 미디어 소개 제외 — 메시지를 하나로.
- 출시 앱만 스토어 버튼, 출시 전·내려간 앱은 "곧 만나요" — 깨진 링크 없이 신뢰 유지.
- 회사 영문명 **Raypick Co., Ltd.** — 애플 판매자 이름·PARRYTHM 사이트와 통일(대표 결정 2026-10-26).
- 영어 대표 이름 **Sangkwon Shin** (대표 확인).
- 궤도 문구에 숫자 안 넣음 — 앱이 계속 늘어나므로.
- three.js 직접 사용(React용 3D 부품 없이) — 부품 최소화. 전체 결정 25개는 docs/DESIGN.md 8절.

## 🚧 지금 막힌 것 / 주의할 점
- **이것좀이 구글 플레이에서 내려가 있음(404, 2026-10-26 확인).** 이유는 저장소에 기록 없음 → Play Console 확인 필요. 다시 올라오면 `apps.ts`에서 thisjom `status: "live"`로만 바꾸면 원래대로.
- 하루요는 아직 진짜 앱 아이콘 없음(Flutter 기본) → 홈페이지는 임시 파스텔 아이콘 사용.
- BEATRAY는 아직 App Store 미출시(구글만).
- 작업용 파일 `public/drafts/`(시안), `_assets/`(원본 자료), `로고.png`는 .gitignore로 제외 — 이 컴퓨터에만 있음.
- 미리보기 서버가 켜진 채 `npm install`을 하면 서버가 깨짐 → 서버 끄고 설치·빌드.
- 배포 전 확인 원칙: main push = 실제 사이트 변경이므로 매번 대표 확인 후 올림.

## ▶️ 다음에 할 일
1. 이것좀이 구글 플레이에 다시 올라오면 `updating` → `live`로 되돌리기 (대표가 알려주면).
2. 하루요 진짜 아이콘·스토어 출시 시 `public/apps/haruyo/` 교체 + `status: "live"`·스토어 링크 추가.
3. BEATRAY App Store 출시 시 `stores.ios` 링크 추가.
