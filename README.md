# 에너지전환진흥원 누리집

가상의 공공기관 **「에너지전환진흥원」** 누리집입니다. 원래 Handlebars 멀티페이지(Vite) + 바닐라 JS로 퍼블리싱되어 있던 것을
**React + TypeScript + React Router(SPA) + CSS Modules** 구조로 전면 전환했습니다.
공공기관 누리집 실무 기준(웹 접근성 · 시맨틱 마크업 · 반응형)은 그대로 유지합니다.

- 스택: React 18, TypeScript, React Router v6(`createBrowserRouter`), Vite, Sass(CSS Modules)
- 대응: PC 1440 기준 / 태블릿 1024 / 모바일 360~768

## 실행

```bash
npm install
npm run dev        # 개발 서버 (http://localhost:5173)
npm run typecheck  # tsc --noEmit
npm run build      # 타입체크 + dist/ 정적 파일 생성
BASE_PATH=/저장소이름/ npm run build   # GitHub Pages 처럼 하위 폴더에 올릴 때
npm run preview    # 빌드 결과 확인
```

## 라우트 (총 24개 + 홈)

`menu.json`의 2단 구조(gnbId/lnbId)를 그대로 `/{gnbId}/{lnbId}` 경로로 씁니다. 사업 상세도 예외 없이
`/business/{id}` 하나로 통일됩니다.

| 영역 | 경로 | 페이지 컴포넌트 |
|---|---|---|
| 홈 | `/` | `pages/home/HomePage` |
| 기관소개 | `/about/greeting`, `/about/vision`, `/about/history`, `/about/org` | `pages/static/*` |
| 주요사업 | `/business/:id` (solar · wind · efficiency 통합) | `pages/business/BusinessDetailPage` |
| 정보공개 | `/info/disclosure`, `/info/request` | `pages/disclosure`, `pages/static/InfoRequestPage` |
| 알림·소식 | `/news/{notice,press,recruit,cardnews}` (+ `/:id` 상세) | `pages/{notice,press,recruit,cardnews}` |
| 참여·민원 | `/participation/petition`, `/participation/status` | `pages/static/Petition*Page` |
| 고객지원 | `/support/{faq,qna,location}` (+ `/support/qna/:id`) | `pages/faq`, `pages/qna`, `pages/static/LocationPage` |
| 정책 | `/policy` | `pages/static/PolicyPage` (SubLayout 밖, 독립 레이아웃) |

라우트의 `handle: { gnbId, lnbId, title?, contentClass? }` 메타데이터를 `SubLayout`과 `Header`가
`useMatches()`로 읽어 breadcrumb·LNB·GNB 강조·서브 비주얼을 그립니다 — 페이지마다 따로 지정할 필요가 없습니다.

## 폴더 구조

```
src/
├─ main.tsx                 ReactDOM root + RouterProvider + ToastProvider + IconSprite
├─ app/
│  ├─ router.tsx            라우트 테이블 (createBrowserRouter)
│  ├─ routeConfig.ts        RouteHandle 타입
│  ├─ RootLayout.tsx        Header + <Outlet/> + Footer, 공통 레이아웃 루트
│  ├─ useRouteHandle.ts     현재 매치의 handle(gnbId/lnbId) 조회
│  └─ AllMenuContext.tsx    전체메뉴 다이얼로그를 앱 루트에서 공유
├─ layout/
│  ├─ Header/               GNB 메가메뉴, 전체메뉴, 통합검색, 글자크기, 유틸바
│  ├─ Footer/
│  └─ SubLayout/             서브페이지 공통 셸 — breadcrumb + LNB + <Outlet/>
├─ pages/                   라우트별 페이지 (home, business, notice, press, qna,
│                           recruit, cardnews, faq, disclosure, static)
├─ components/              재사용 UI — 컴포넌트당 `Component.tsx` + `Component.module.scss`
├─ data/                    JSON(`data/json/*.json`) + TypeScript 타입 + 래퍼
├─ hooks/                   바닐라 JS 모듈을 대체한 커스텀 훅 (아래 표)
├─ utils/                   depth1/depth2, find/where/take, statusVariant, isoDate 등
└─ styles/                  tokens.scss · mixins.scss(디자인 토큰, 전역) · global.scss(리셋/베이스)
```

## 디자인 토큰

값은 `src/styles/tokens.scss` 한 곳에만 있고, 모든 `*.module.scss`는 파일 맨 위에서
`@use 'tokens' as *; @use 'mixins' as *;` 로 불러와 **숫자·색을 직접 쓰지 않고** 아래 함수로만 꺼냅니다.
없는 키를 쓰면 빌드가 실패하므로 오타도 바로 잡힙니다.

| 종류 | 사용법 | 예시 결과 |
|---|---|---|
| 색 | `c('primary')` · `ca('white', .6)` | `var(--c-primary)` · `rgba(255,255,255,.6)` |
| 그라디언트 | `gradient('brand')` | 남색→파랑→청록 |
| 간격 (4px 그리드) | `sp(4)` · `sp(2.5)` | `16px` · `10px` |
| 타이포 (역할 기반) | `@include type('h4')` · `type('label', bold)` · `fs('body')` | 크기·굵기·행간·자간 한 번에 |
| 반경 / 그림자 | `r('lg')` · `shadow('md')` | `16px` · 카드 그림자 |
| 레이어 | `z('header')` | `100` |
| 반응형 | `@include down('md') { }` | `max-width: 767.98px` |

- 글자 크기는 rem이라 **글자크기 조절 버튼**(`useFontSize`, html `data-font-scale`)에 전체가 비례합니다.
- 색은 `:root` CSS 변수로도 출력되어 런타임에 바꿀 수 있습니다.
- `.sr-only`, `.img-3d`(mix-blend-mode 합성), `.num`, `.container` 등은 CSS Modules로 스코프하지 않는
  전역 유틸리티로 `global.scss`에 남아 있습니다.

## 바닐라 JS → React 훅

기존 `src/js/modules/*.js`의 동작을 그대로(또는 더 접근성 있게) 포팅한 훅들입니다.

| 훅 | 대응 기능 |
|---|---|
| `useDialog` | 모달 포커스 트랩 · ESC 닫기 · 스크롤 잠금 · 포커스 복귀 (전체메뉴 등) |
| `useGnbMegaMenu` | GNB hover/focus 메가메뉴 (데스크톱 전용) |
| `useFontSize` / `useHeaderSearch` / `useDropdown` / `useTopButton` | 헤더 유틸리티 |
| `useTabs` / `useAccordion` / `useChipFilter` / `useAnchorTabs` | ARIA 탭 · 아코디언 · 카테고리 필터 · 스크롤 연동 탭 |
| `useSlider` / `useRollingBanner` | 슬라이더 자동재생(`prefers-reduced-motion` 비활성화) · 관련사이트 롤링 |
| `useCharCounter` / `useFileValidation` / `useEmailDomainSelect` / `useFormValidation` | 민원 폼 입력 보조 |
| `useLookup` / `useSurvey` / `usePageTools` / `useCopyToClipboard` | 조회 포커스 이동 · 만족도조사 · 공유/인쇄 · 복사 |
| `useScrollToTop` | 라우트 전환 시 스크롤 리셋 (멀티페이지에서는 공짜였던 동작) |

## 컴포넌트 재사용

목록은 전부 데이터로 그립니다. 공지사항을 한 건 추가하려면 `data/json/notices.json`에 항목만 넣으면 됩니다.
사업 상세도 템플릿 하나(`pages/business/BusinessDetailPage`)이므로, 새 사업은 `business.json`에
항목을 추가하면 메인 '주요사업' 카드와 `/business/{id}` 상세가 함께 생깁니다.

대표 공용 컴포넌트: `Icon`(SVG 스프라이트) · `Badge` · `Button`/`IconButton` · `SlideStack`(캐러셀 공통 패턴) ·
`BoardTable` · `SearchFilter` · `ListInfo` · `Pagination` · `ChipFilter` · `AttachmentList`(신규 추출) ·
`ProgramBanner` · `KeyFacts` · `DataTable` · `ContactInfo` · `Steps` · `Stepper` · `Tracker`.

## 웹 접근성 (KWCAG 2.2 대응)

| 항목 | 적용 내용 |
|---|---|
| 반복 영역 건너뛰기 | 본문 / 주메뉴 바로가기 링크 |
| 제목 제공 | 페이지별 고유 `<title>`, h1(로고)~h4 계층 |
| 키보드 사용 | GNB는 Tab 포커스로도 열림, ESC로 닫고 1depth로 포커스 복귀 |
| 초점 이동 | 전체메뉴 모달: 포커스 트랩 · ESC 닫기 · 열었던 버튼으로 포커스 복귀 (`useDialog`) |
| 대체 텍스트 | 카드뉴스는 이미지가 아닌 HTML 텍스트로 그려 스크린리더가 그대로 읽음 + 전체 `<details>` 텍스트 버전, 지도에 위치 설명 |
| 정지 기능 | 메인 비주얼 · 관련사이트 롤링에 정지/재생 버튼, hover·focus 시 일시정지, `prefers-reduced-motion` 시 자동재생 안 함 |
| 탭 | `role="tablist"` + 좌우 화살표 · Home/End 키 (`useTabs`) |
| 아코디언 | `button[aria-expanded]` + `role="region"` |
| 표 | `caption`, `scope` 지정, 모바일에서는 카드형으로 전환(시맨틱 유지) |
| 레이블 | 모든 입력 요소에 `label`/`legend`, 필수 항목 표시, `aria-invalid` + `aria-errormessage` 오류 안내 |
| 새 창 | 새 창으로 열리는 링크에 안내 텍스트 |
| 현재 위치 | GNB·LNB·브레드크럼에 `aria-current` |

SPA 전환에서 새로 생긴 주의점: `IntersectionObserver`/`ResizeObserver`/`matchMedia` 리스너를 쓰는 훅은
모두 `useEffect` cleanup에서 해제합니다(멀티페이지에서는 페이지 이동마다 공짜로 해제됐던 부분). 라우트
전환 시 스크롤 위치는 `useScrollToTop`이 되돌립니다.

## 카드뉴스 디자인

카드뉴스는 이미지 파일이 아니라 **데이터(`cardnews.json`) → 컴포넌트(`CardnewsCard`)** 로 그립니다.

- 모티프: 가전제품의 **에너지소비효율등급 라벨**. 카드 오른쪽의 1~5등급 색 막대와 ◀ 화살표가 라벨처럼 보이면서,
  화살표가 장을 넘길수록 아래로 내려가 **진행 위치 표시** 역할을 합니다.
- 장 종류: 표지(cover) · 질문/답(qa) · 숫자(stat) · 체크리스트(list) · 절차(steps) · 마무리(end). JSON 에 장을 추가하면 끝.
- 톤 5가지(mint · blue · warm · navy · green)를 CSS 변수로 바꿔 끼웁니다.
- 모든 치수를 카드 너비 기준 `cqw`(container query 단위)로 잡아, 목록 썸네일 · 메인 화면 · 상세 뷰어에서 같은 디자인이 비율 그대로 줄어듭니다.
- 상세 뷰어: 버튼 · 좌우 방향키 · 모바일 스와이프 · 장 미리보기로 이동, 자동재생 없음, 바뀐 장 번호를 `aria-live` 로 안내.

## 원본(HTML 버전)과 동일성 검수

React 전환 후 원본과 25페이지 × 2해상도(1440·390)를 자동 비교했습니다.
화면 캡처 픽셀 비교 + 텍스트·아이콘 요소별 크기/위치/색 비교로 차이를 찾아 고쳤고, 카드뉴스(새 디자인)를 뺀 모든 페이지가 원본과 같은 화면입니다.
전환 과정에서 빠졌던 기능(GNB 전체 펼침 · ESC 닫기, 처리현황 예시 결과, 상세 글 원문 등)도 복구했습니다.

## 참고

- 기관명, 주소, 연락처, 통계 수치는 모두 가상의 데이터입니다.
- 사진·3D 그래픽·인사말 기관장 사진은 AI로 생성한 이미지이며, 기관장은 실존하지 않는 가상 인물입니다.
- 폰트: Pretendard(본문), Inter(숫자) — CDN 로드
