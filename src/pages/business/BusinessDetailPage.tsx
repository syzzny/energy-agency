import { useParams } from 'react-router-dom';
import { ProgramBanner } from '@/components/ProgramBanner';
import { KeyFacts } from '@/components/KeyFacts';
import { AnchorTabs } from '@/components/AnchorTabs';
import { Heading } from '@/components/Heading';
import { DataTable } from '@/components/DataTable';
import { Steps } from '@/components/Steps';
import { ContactInfo } from '@/components/ContactInfo';
import { Survey } from '@/components/Survey';
import { business } from '@/data/business';
import { findById } from '@/utils/array';
import styles from './BusinessDetailPage.module.scss';

const TABS = [
  { id: 'overview', label: '사업개요' },
  { id: 'support', label: '지원내용' },
  { id: 'process', label: '진행절차' },
  { id: 'contact', label: '문의처' },
];

export default function BusinessDetailPage() {
  const { id } = useParams();
  const item = findById(business, id) ?? business[0];

  return (
    <>
      <div className={styles.introGroup}>
        <ProgramBanner image={item.image} badge={item.badge} title={item.title} desc={item.desc} cta={item.cta} guide={item.guide} />
        <KeyFacts items={item.facts} />
        <AnchorTabs items={TABS.map((t) => (t.id === 'process' ? { ...t, label: item.processTitle } : t))} />
      </div>

      <section className={styles.sectionBlock} id="overview" aria-labelledby="overviewTitle">
        <Heading id="overviewTitle" title="사업개요" />
        <p className={styles.contentText}>{item.overview}</p>
      </section>

      <section className={styles.sectionBlock} id="support" aria-labelledby="supportTitle">
        <Heading id="supportTitle" title="지원내용" desc={item.support.desc} />
        <DataTable caption={item.support.caption} cols={item.support.cols} rows={item.support.rows} />
      </section>

      <section className={styles.sectionBlock} id="process" aria-labelledby="processTitle">
        <Heading id="processTitle" title={item.processTitle} />
        <Steps items={item.steps} />
      </section>

      <section className={styles.sectionBlock} id="contact" aria-labelledby="contactTitle">
        <Heading id="contactTitle" title="문의처" />
        <ContactInfo {...item.contact} />
      </section>

      <Survey dept={item.dept} />
    </>
  );
}
