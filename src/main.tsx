// 전역 스타일(리셋·.icon·.num 등)은 반드시 가장 먼저 불러온다.
// 나중에 불러오면 같은 우선순위의 컴포넌트 스타일(아이콘 크기 등)을 덮어쓴다.
import '@/styles/global.scss';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { router } from './app/router';
import { ToastProvider } from '@/components/Toast';
import { IconSprite } from '@/components/Icon';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <IconSprite />
        <RouterProvider router={router} />
      </ToastProvider>
    </QueryClientProvider>
  </StrictMode>,
);
