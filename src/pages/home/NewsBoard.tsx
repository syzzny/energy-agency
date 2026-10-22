import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Badge, NewBadge } from '@/components/Badge';
import chipStyles from '@/components/Badge/Badge.module.scss';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/Button';
import btnStyles from '@/components/Button/Button.module.scss';
import { notices } from '@/data/notices';
import { press } from '@/data/press';
import { recruit } from '@/data/recruit';
import { cardnews } from '@/data/cardnews';
import { take } from '@/utils/array';
import { isoDate } from '@/utils/date';
import { statusVariant } from '@/utils/status';
import { useTabs, useSlider } from '@/hooks';
import { CardnewsCard } from '@/components/CardnewsCard';
import styles from './HomePage.module.scss';

interface Row {
  key: string;
  href: string;
  badge: string;
  badgeVariant: ReturnType<typeof statusVariant>;
  title: string;
  isNew?: boolean;
  date: string;
}

export default function NewsBoard() {
  const tabs = useTabs({ ids: ['notice', 'press', 'recruit'] });

  const noticeRows: Row[] = take(notices, 5).map((n) => ({
    key: n.id,
    href: `/news/notice/${n.id}`,
    badge: n.category,
    badgeVariant: statusVariant(n.category),
    title: n.title,
    isNew: n.isNew,
    date: n.date,
  }));
  const pressRows: Row[] = take(press, 3).map((p) => ({
    key: p.id,
    href: `/news/press/${p.id}`,
    badge: '보도',
    badgeVariant: null,
    title: p.title,
    date: p.date,
  }));
  const recruitRows: Row[] = take(recruit, 2).map((r) => ({
    key: r.id,
    href: `/news/recruit/${r.id}`,
    badge: '채용',
    badgeVariant: null,
    title: r.title,
    date: r.date,
  }));

  const panels: Record<string, Row[]> = { notice: noticeRows, press: pressRows, recruit: recruitRows };
  const labels: Record<string, string> = { notice: '공지사항', press: '보도자료', recruit: '채용공고' };

  return (
    <section className={styles.news} aria-labelledby="newsTitle">
      <div className={clsx('container', styles.newsInner)}>
        <div>
          <div className={styles.newsHead}>
            <div className={styles.newsHeadLeft}>
              <h3 className={styles.sectionHeadTitle} id="newsTitle">
                알림·소식
              </h3>
              <div className={styles.newsTabs} role="tablist" aria-label="게시판 선택">
                {(['notice', 'press', 'recruit'] as const).map((id, i) => (
                  <button key={id} className={chipStyles.chip} {...tabs.getTabProps(id, i)}>
                    {labels[id]}
                  </button>
                ))}
              </div>
            </div>
            <Link to="/news/notice" className={btnStyles.iconBtn}>
              <Icon name="plus" />
              <span className="sr-only">알림·소식 더보기</span>
            </Link>
          </div>

          {(['notice', 'press', 'recruit'] as const).map((id) => (
            <div key={id} className={styles.newsPanel} {...tabs.getPanelProps(id)}>
              <ul>
                {panels[id].map((row) => (
                  <li key={row.key}>
                    <Link to={row.href} className={styles.newsRow}>
                      <Badge label={row.badge} variant={row.badgeVariant} />
                      <span className={styles.newsTitle}>{row.title}</span>
                      {row.isNew && <NewBadge className={styles.newsNew} />}
                      <time className={styles.newsDate} dateTime={isoDate(row.date)}>
                        {row.date}
                      </time>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <CardNewsSlider />
      </div>
    </section>
  );
}

function CardNewsSlider() {
  const items = take(cardnews, 3);
  // 정지 버튼이 없으므로 자동으로 넘기지 않는다 (사용자가 직접 넘김)
  const slider = useSlider({ slideCount: items.length, hasToggle: false });

  return (
    <section className={styles.cardNewsSection} aria-labelledby="cardNewsTitle">
      <div className={styles.newsCardHead}>
        <h3 className={styles.sectionHeadTitle} id="cardNewsTitle">
          카드뉴스
        </h3>
        <div className={styles.newsCardPager}>
          <IconButton icon="left" label="이전 카드뉴스" onClick={slider.prev} />
          <IconButton icon="right" label="다음 카드뉴스" onClick={slider.next} />
        </div>
      </div>
      <div className={styles.heroSlides}>
        {items.map((item, i) => (
          <Link
            key={item.id}
            to={`/news/cardnews/${item.id}`}
            className={clsx(styles.cardNewsLink, styles.heroSlide, i === slider.index && styles.active)}
            aria-hidden={i !== slider.index}
            tabIndex={i === slider.index ? undefined : -1}
          >
            <span aria-hidden="true">
              <CardnewsCard item={item} index={0} ratio="wide" />
            </span>
            <span className="sr-only">
              {item.title} ({i + 1} / {items.length})
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
