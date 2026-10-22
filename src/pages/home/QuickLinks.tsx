import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { quick } from '@/data/quick';
import { useAllMenu } from '@/app/AllMenuContext';
import btnStyles from '@/components/Button/Button.module.scss';
import styles from './HomePage.module.scss';

const SUB_TO_ROUTE: Record<string, string> = {
  'sub/notice-list.html': '/news/notice',
  'sub/business-solar.html': '/business/solar',
  'sub/business-wind.html': '/business/wind',
  'sub/business-efficiency.html': '/business/efficiency',
  'sub/petition.html': '/participation/petition',
  'sub/petition-status.html': '/participation/status',
  'sub/faq.html': '/support/faq',
  'sub/qna.html': '/support/qna',
  'sub/recruit.html': '/news/recruit',
  'sub/disclosure.html': '/info/disclosure',
};

export default function QuickLinks() {
  const allmenu = useAllMenu();

  return (
    <section className={styles.quick} aria-labelledby="quickTitle">
      <div className="container">
        <div className={styles.sectionHead}>
          <h3 className={styles.sectionHeadTitle} id="quickTitle">
            자주 찾는 서비스
          </h3>
          <button type="button" className={btnStyles.moreLink} onClick={(e) => allmenu.open(e.currentTarget)}>
            전체 서비스 보기
            <Icon name="right" />
          </button>
        </div>
        <ul className={styles.quickList}>
          {quick.map((q) => (
            <li key={q.label}>
              <Link to={SUB_TO_ROUTE[q.href] ?? '/'} className={styles.quickLink}>
                <span className={styles.quickIcon}>
                  <Icon name={q.icon} />
                </span>
                {q.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
