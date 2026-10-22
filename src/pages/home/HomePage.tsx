import Hero from './Hero';
import QuickLinks from './QuickLinks';
import NewsBoard from './NewsBoard';
import StatsSection from './StatsSection';
import BizSection from './BizSection';
import RelatedSites from './RelatedSites';
import styles from './HomePage.module.scss';

export default function HomePage() {
  return (
    <main className={styles.main} id="content" tabIndex={-1}>
      <h2 className="sr-only">에너지전환진흥원 메인</h2>
      <Hero />
      <QuickLinks />
      <NewsBoard />
      <StatsSection />
      <BizSection />
      <RelatedSites />
    </main>
  );
}
