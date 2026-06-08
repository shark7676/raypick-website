# Raypick 작업 기록 (CHANGELOG)

> 새로 작업을 시작할 때 이 문서를 먼저 보면 현재 상태와 작업 방법을 빠르게 파악할 수 있습니다.

## 프로젝트 개요
- **무엇**: Raypick(법인) 홈페이지 — 앱 개발 + 자체 미디어(유튜브/라이브/영상제작) 크리에이티브 그룹
- **스택**: Next.js 16 (App Router) · React 19 · TypeScript · CSS Modules + styled-jsx
- **테마**: 다크 + 절제된 골드/실버 프리미엄. 폰트 Syne(제목) + Pretendard(본문)
- **다국어**: 한국어/영어 전환 (`src/context/LanguageContext.tsx`, 텍스트는 `src/data/translations.ts`)
- **배포**: Vercel → 공개 도메인 **https://www.raypick.co.kr**
- **저장소**: github.com/shark7676/raypick-website (`main`)

## 화면 구조
- 홈 히어로: 에디토리얼 타이포 + **AI 코드 에디터**(`src/components/CodeHero.tsx`, 타이핑+AI 파이프라인) + **위로 흐르는 녹색 매트릭스 코드**(`src/components/MatrixRain.tsx`)
- 앱 포트폴리오: `src/components/AppShowcase.tsx` (데이터: `src/data/apps.ts`)
- 회사소개 / 서비스 / 문의: `src/app/about|services|contact/page.tsx`
- 공통: `Navbar.tsx`(스크롤 인식), `Reveal.tsx`(스크롤 등장), 스타일 `src/app/page.module.css` · `globals.css`

---

## 2026-06-08 — 전면 리뉴얼
- 기존 시안 네온 테마·3D 로봇 제거 → **다크+골드/실버 프리미엄** 디자인 시스템으로 전면 개편
- 히어로를 여러 시안 끝에 **AI 코드 에디터 + 녹색 매트릭스 코드 배경**으로 확정 (로봇·로고 엠블럼은 반려)
- 앱을 **3종으로 교체**(Cosync 폐기): 다광 / pixory / 다보자 — 전부 "출시 예정" + 데모 이미지
- 앱을 **데이터 드리븐**으로 재설계(`apps.ts`) → 앞으로 앱 추가가 쉬움
- 미디어 섹션 문구를 자체 유튜브/라이브/오리지널 제작 중심으로 갱신
- 스크롤 등장 애니메이션, 스크롤 인식 내비, 영문 제목 폰트 별도 처리, 한글 줄바꿈 정리(`word-break: keep-all`)
- 모바일 최적화: 반응형 레이아웃, 매트릭스 표시(전체폭·옅게), 가로 오버플로우 제거, 화면 밖 애니메이션 정지(성능)
- 코드 최적화/디버깅: 미사용 3D 의존성 제거(npm 68패키지↓), ESLint 0, `next` 16.1.1→16.2.7(보안)
- 커밋·배포 완료

### 2026-06-08 (저녁) — 매트릭스 시네마틱 다듬기
- 배경 코드(`MatrixRain.tsx`)를 영화처럼: 밝은 선두 → 위로 갈수록 페이드(잔상), 은은한 네온 글로우, 글자 글리치
- **가타카나(일본어) 제거** → 글리치도 코드 문자만 사용(허접한 느낌 제거)
- 모바일 가시성 개선: 페이드 하한선(floor) + 불투명도 1.0 + 베일 완화로 또렷하게
- 조정 포인트: 밝기/속도(`speed`)/글로우(`glow`)/글리치 빈도(`frame % N`)는 `MatrixRain.tsx`에서, 불투명도·베일은 `page.module.css`의 `.heroMatrix`/`.heroVeil`

---

## 자주 하는 작업 방법

### 앱 추가 / 실제 이미지로 교체
`src/data/apps.ts` 한 곳만 수정합니다.
- **추가**: 배열에 객체 1개 추가 + `public/images/<slug>/`에 로고+스크린샷 2장
- **실제 이미지로 교체**(예: 다광): `images`를 실제 파일 경로로, `demo: true` 제거, `status: 'coming'` → `'live'`
  - 다광 실제 이미지는 이미 repo에 있음: `/images/dagwang/logo.png`, `screenshot1.jpg`, `screenshot2.jpg`

### 텍스트(문구) 수정
`src/data/translations.ts`에서 `ko`/`en` 양쪽을 수정.

### 로컬 실행 / 빌드
```bash
npm run dev      # 로컬 개발 서버
npm run build    # 프로덕션 빌드(오류 점검)
npm run lint     # 린트
```

### 배포 (프로덕션)
> main에 push만으로는 자동 배포되지 않습니다. 아래 명령을 직접 실행해야 합니다.
```bash
npx vercel --prod --yes
```
배포 후 https://www.raypick.co.kr 확인.

---

## 보류 / 예정
- **공지(배너) 올리고 내리기 기능**: 보류 중. 필요 시 두 방식 중 선택 — (1) Vercel Edge Config 대시보드 토글(재배포 불필요), (2) GitHub 파일 편집(자동 배포).
- **포트폴리오 실제 이미지**: 앱 완성 시 데모 → 실제로 교체.
