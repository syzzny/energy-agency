import { Outlet } from 'react-router-dom';
import { Header } from '@/layout/Header';
import { Footer } from '@/layout/Footer';
import { useScrollToTop } from '@/hooks';
import { AllMenuProvider } from './AllMenuContext';

export default function RootLayout() {
  useScrollToTop();
  return (
    <AllMenuProvider>
      <Header />
      <Outlet />
      <Footer />
    </AllMenuProvider>
  );
}
