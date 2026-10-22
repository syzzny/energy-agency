import type { ComponentType } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './RootLayout';
import { SubLayout } from '@/layout/SubLayout';
import Placeholder from '@/pages/Placeholder';
import HomePage from '@/pages/home/HomePage';
import type { RouteHandle } from './routeConfig';

/**
 * 페이지별 코드 분할 — 첫 화면(메인)만 기본 번들에 넣고, 나머지 페이지는 들어갈 때 불러온다.
 * 첫 방문에서 내려받고 해석할 자바스크립트가 줄어 첫 화면 표시와 반응 속도가 빨라진다.
 */
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({ Component: (await load()).default });

const handle = (gnbId: string, lnbId: string | null, extra?: Partial<RouteHandle>): RouteHandle => ({
  gnbId,
  lnbId,
  ...extra,
});

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'policy', lazy: page(() => import('@/pages/static/PolicyPage')) },
      { path: 'login', lazy: page(() => import('@/pages/auth/LoginPage')) },
      { path: 'signup', lazy: page(() => import('@/pages/auth/SignupPage')) },
      {
        element: <SubLayout />,
        children: [
          { path: 'about/greeting', lazy: page(() => import('@/pages/static/GreetingPage')), handle: handle('about', 'greeting') },
          { path: 'about/vision', lazy: page(() => import('@/pages/static/VisionPage')), handle: handle('about', 'vision', { contentClass: 'contentWideGap' }) },
          { path: 'about/history', lazy: page(() => import('@/pages/static/HistoryPage')), handle: handle('about', 'history') },
          { path: 'about/org', lazy: page(() => import('@/pages/static/OrgPage')), handle: handle('about', 'org', { contentClass: 'contentWideGap' }) },

          { path: 'business/:id', lazy: page(() => import('@/pages/business/BusinessDetailPage')), handle: handle('business', null, { contentClass: 'contentWideGap' }) },

          { path: 'info/disclosure', lazy: page(() => import('@/pages/disclosure/DisclosureListPage')), handle: handle('info', 'disclosure') },
          // 차트 라이브러리(ECharts)는 이 페이지 조각에만 들어간다
          { path: 'info/stats', lazy: page(() => import('@/pages/stats/StatsPage')), handle: handle('info', 'stats') },
          { path: 'info/request', lazy: page(() => import('@/pages/static/InfoRequestPage')), handle: handle('info', 'request', { contentClass: 'contentWideGap' }) },

          { path: 'news/notice', lazy: page(() => import('@/pages/notice/NoticeListPage')), handle: handle('news', 'notice') },
          { path: 'news/notice/:id', lazy: page(() => import('@/pages/notice/NoticeViewPage')), handle: handle('news', 'notice') },
          { path: 'news/press', lazy: page(() => import('@/pages/press/PressListPage')), handle: handle('news', 'press') },
          { path: 'news/press/:id', lazy: page(() => import('@/pages/press/PressViewPage')), handle: handle('news', 'press') },
          { path: 'news/recruit', lazy: page(() => import('@/pages/recruit/RecruitListPage')), handle: handle('news', 'recruit') },
          { path: 'news/recruit/:id', lazy: page(() => import('@/pages/recruit/RecruitViewPage')), handle: handle('news', 'recruit') },
          { path: 'news/cardnews', lazy: page(() => import('@/pages/cardnews/CardnewsListPage')), handle: handle('news', 'cardnews') },
          { path: 'news/cardnews/:id', lazy: page(() => import('@/pages/cardnews/CardnewsViewPage')), handle: handle('news', 'cardnews') },

          { path: 'participation/petition', lazy: page(() => import('@/pages/static/PetitionPage')), handle: handle('participation', 'petition') },
          { path: 'participation/status', lazy: page(() => import('@/pages/static/PetitionStatusPage')), handle: handle('participation', 'status', { contentClass: 'contentWideGap' }) },

          { path: 'support/faq', lazy: page(() => import('@/pages/faq/FaqPage')), handle: handle('support', 'faq') },
          { path: 'support/qna', lazy: page(() => import('@/pages/qna/QnaListPage')), handle: handle('support', 'qna') },
          { path: 'support/qna/mine', lazy: page(() => import('@/pages/qna/MyQnaPage')), handle: handle('support', 'qna', { title: '내 질문' }) },
          { path: 'support/qna/new', lazy: page(() => import('@/pages/qna/QnaWritePage')), handle: handle('support', 'qna') },
          { path: 'support/qna/:id', lazy: page(() => import('@/pages/qna/QnaViewPage')), handle: handle('support', 'qna') },
          { path: 'support/location', lazy: page(() => import('@/pages/static/LocationPage')), handle: handle('support', 'location', { contentClass: 'contentWideGap' }) },
        ],
      },
      { path: '*', element: <Placeholder label="페이지를 찾을 수 없습니다" /> },
    ],
  },
], {
  // vite base(BASE_PATH)와 맞춰 하위 폴더 배포에서도 라우팅되도록
  basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/',
});
