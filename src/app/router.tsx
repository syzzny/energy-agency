import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './RootLayout';
import { SubLayout } from '@/layout/SubLayout';
import Placeholder from '@/pages/Placeholder';
import HomePage from '@/pages/home/HomePage';
import PolicyPage from '@/pages/static/PolicyPage';
import NoticeListPage from '@/pages/notice/NoticeListPage';
import NoticeViewPage from '@/pages/notice/NoticeViewPage';
import PressListPage from '@/pages/press/PressListPage';
import PressViewPage from '@/pages/press/PressViewPage';
import QnaListPage from '@/pages/qna/QnaListPage';
import QnaViewPage from '@/pages/qna/QnaViewPage';
import QnaWritePage from '@/pages/qna/QnaWritePage';
import RecruitListPage from '@/pages/recruit/RecruitListPage';
import RecruitViewPage from '@/pages/recruit/RecruitViewPage';
import FaqPage from '@/pages/faq/FaqPage';
import DisclosureListPage from '@/pages/disclosure/DisclosureListPage';
import CardnewsListPage from '@/pages/cardnews/CardnewsListPage';
import CardnewsViewPage from '@/pages/cardnews/CardnewsViewPage';
import BusinessDetailPage from '@/pages/business/BusinessDetailPage';
import GreetingPage from '@/pages/static/GreetingPage';
import VisionPage from '@/pages/static/VisionPage';
import InfoRequestPage from '@/pages/static/InfoRequestPage';
import LocationPage from '@/pages/static/LocationPage';
import HistoryPage from '@/pages/static/HistoryPage';
import OrgPage from '@/pages/static/OrgPage';
import PetitionPage from '@/pages/static/PetitionPage';
import PetitionStatusPage from '@/pages/static/PetitionStatusPage';
import type { RouteHandle } from './routeConfig';

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
      { path: 'policy', element: <PolicyPage /> },
      {
        element: <SubLayout />,
        children: [
          { path: 'about/greeting', element: <GreetingPage />, handle: handle('about', 'greeting') },
          { path: 'about/vision', element: <VisionPage />, handle: handle('about', 'vision', { contentClass: 'contentWideGap' }) },
          { path: 'about/history', element: <HistoryPage />, handle: handle('about', 'history') },
          { path: 'about/org', element: <OrgPage />, handle: handle('about', 'org', { contentClass: 'contentWideGap' }) },

          { path: 'business/:id', element: <BusinessDetailPage />, handle: handle('business', null, { contentClass: 'contentWideGap' }) },

          { path: 'info/disclosure', element: <DisclosureListPage />, handle: handle('info', 'disclosure') },
          // 차트 라이브러리(ECharts)가 무거워서 이 페이지에 들어올 때만 따로 불러온다 (코드 분할)
          { path: 'info/stats', lazy: async () => ({ Component: (await import('@/pages/stats/StatsPage')).default }), handle: handle('info', 'stats') },
          { path: 'info/request', element: <InfoRequestPage />, handle: handle('info', 'request', { contentClass: 'contentWideGap' }) },

          { path: 'news/notice', element: <NoticeListPage />, handle: handle('news', 'notice') },
          { path: 'news/notice/:id', element: <NoticeViewPage />, handle: handle('news', 'notice') },
          { path: 'news/press', element: <PressListPage />, handle: handle('news', 'press') },
          { path: 'news/press/:id', element: <PressViewPage />, handle: handle('news', 'press') },
          { path: 'news/recruit', element: <RecruitListPage />, handle: handle('news', 'recruit') },
          { path: 'news/recruit/:id', element: <RecruitViewPage />, handle: handle('news', 'recruit') },
          { path: 'news/cardnews', element: <CardnewsListPage />, handle: handle('news', 'cardnews') },
          { path: 'news/cardnews/:id', element: <CardnewsViewPage />, handle: handle('news', 'cardnews') },

          { path: 'participation/petition', element: <PetitionPage />, handle: handle('participation', 'petition') },
          { path: 'participation/status', element: <PetitionStatusPage />, handle: handle('participation', 'status', { contentClass: 'contentWideGap' }) },

          { path: 'support/faq', element: <FaqPage />, handle: handle('support', 'faq') },
          { path: 'support/qna', element: <QnaListPage />, handle: handle('support', 'qna') },
          { path: 'support/qna/new', element: <QnaWritePage />, handle: handle('support', 'qna') },
          { path: 'support/qna/:id', element: <QnaViewPage />, handle: handle('support', 'qna') },
          { path: 'support/location', element: <LocationPage />, handle: handle('support', 'location', { contentClass: 'contentWideGap' }) },
        ],
      },
      { path: '*', element: <Placeholder label="페이지를 찾을 수 없습니다" /> },
    ],
  },
], {
  // vite base(BASE_PATH)와 맞춰 하위 폴더 배포에서도 라우팅되도록
  basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/',
});
