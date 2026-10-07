# Raypick 작업 기록 (CHANGELOG)

> 새로 작업을 시작할 때 이 문서를 먼저 보면 현재 상태와 작업 방법을 빠르게 파악할 수 있습니다.
> 현재 진행 상황은 [CONTEXT.md](CONTEXT.md), 설계와 결정 이유는 [docs/DESIGN.md](docs/DESIGN.md).

## 프로젝트 개요
- **무엇**: Raypick(주식회사 레이픽) 회사 홈페이지 — "실제로 앱을 출시하는 회사"로 보이게 하는 것이 목적
- **스택**: Next.js 16 (App Router) · React 19 · TypeScript · CSS Modules · three.js(3D)
- **테마**: 어두운 첫 화면(3D 로고·앱 궤도) → 빛이 퍼지며 밝은 스튜디오(3D 휴대폰). 폰트 Pretendard(본문) + Michroma(영문 포인트)
- **다국어**: 한국어/영어 전환 (`src/context/LanguageContext.tsx`, 텍스트는 `src/data/translations.ts`)
- **배포**: Vercel → 공개 도메인 **https://www.raypick.co.kr**
- **저장소**: github.com/shark7676/raypick-website (`main`)

## 화면 구조
- 첫 화면 + 앱 궤도: `src/components/HeroStage.tsx` (3D: `src/lib/three/heroScene.ts`, 로고 도형 `logoPaths.ts`)
  - 스크롤하면 3D 로고가 가운데로 오고 앱 5개가 궤도로 나옴 → 끝에서 빛이 퍼지며 밝은 화면으로 전환
- 출시 앱 소개: `src/components/AppShowcase.tsx` (3D 휴대폰: `src/lib/three/phoneScene.ts`)
- 출시 예정 / 회사 소개 / 문의 / 바닥글: `Upcoming.tsx`, `About.tsx`, `Contact.tsx`, `Footer.tsx`
- 앱별 페이지: `src/app/apps/[slug]/page.tsx` + `src/components/AppDetail.tsx`
- 옛 주소 `/about`, `/services`, `/contact`는 메인의 해당 위치로 이동 (`next.config.ts`)

---

## 2026-10-08 — 전면 리뉴얼 (앱 회사 중심 + 3D)
- 목적을 **회사 신뢰도**로 정하고 미디어(유튜브) 소개를 뺌. 메시지 = "앱을 만드는 회사"
- 앱을 **실제 출시 기준**으로 교체: 출시 BEATRAY · Gallory · 이것좀 (스토어 버튼), 출시 예정 PARRYTHM · 하루요. 다광 · 다보자 · pixory 제외
- 로고를 **SVG로 다시 그림**(`public/brand/`, 원본 일치율 97.7%) → 3D 조형물로 사용
- 3D 첫 화면: 남색 금속 R + 빛나는 유리 삼각형 + 빛줄기 → 스크롤하면 앱 5개가 빛 점선 궤도를 돎(끌어서 돌리기)
- 밝은 스튜디오: 3D 휴대폰에 실제 앱 화면이 돌아가고, 보고 있는 앱이 앞으로 나옴
- 성능: 글자는 CSS 애니메이션으로 바로 표시, 3D는 화면이 그려진 뒤 시작, 화면 밖에서는 3D 정지, Pretendard를 npm으로 내장
- 3D가 안 되는 기기에서는 그림으로 대체. 접근성·SEO 100점(Lighthouse)
- `next` 16.2.7 → 16.4.0 (심각 등급 보안 경고 해결)
- 이전 디자인 파일(CodeHero, MatrixRain, 옛 이미지 등) 삭제

## 2026-06-08 — (이전 디자인) 다크+골드 리뉴얼, 매트릭스 히어로
- AI 코드 에디터 + 녹색 매트릭스 코드 배경 히어로, 앱 3종(다광/pixory/다보자) 데모. 2026-10-08 리뉴얼로 대체됨

---

## 자주 하는 작업 방법

### 앱 추가 / 출시 상태 바꾸기
`src/data/apps.ts` 한 곳만 수정합니다.
- **추가**: 배열에 객체 1개 추가 + `public/apps/<slug>/`에 `icon.webp`(512px), 휴대폰 화면 `screen1.webp…`(1:2 비율), 스토어 스크린샷 `shot1.webp…`
- **출시되면**: `status: "coming"` → `"live"`, `stores`에 Google Play / App Store 링크, `screens`에 실제 화면
- 첫 화면 궤도·출시 앱 소개·바닥글·앱별 페이지가 모두 자동으로 따라 바뀝니다

### 텍스트(문구) 수정
`src/data/translations.ts`에서 `ko`/`en` 양쪽을 수정.

### 로컬 실행 / 빌드
```bash
npm run dev      # 로컬 개발 서버
npm run build    # 프로덕션 빌드(오류 점검)
npm run lint     # 린트
```

### 배포 (프로덕션)
배포 후 https://www.raypick.co.kr 확인.

---

## 보류 / 예정
- **하루요 앱 아이콘**: 진짜 아이콘이 나오면 `public/apps/haruyo/icon.webp` 교체 (지금은 임시)
- **영어 대표 이름 표기**: `translations.ts`의 `footer.ceo` (지금은 "Sangkwon Shin" 임시)
