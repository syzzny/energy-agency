import clsx from 'clsx';
import { IconButton } from '@/components/Button';
import { useRollingBanner } from '@/hooks';
import styles from './HomePage.module.scss';

const SITES = ['탄소중립 정책포털', '재생에너지 클라우드', '에너지 통계 플랫폼', '녹색건축 인증센터', '청정수소 정보망', '지역에너지 지원센터', '에너지 효율 진단센터'];

export default function RelatedSites() {
  const rolling = useRollingBanner(SITES.length);

  return (
    <section className={styles.related} aria-labelledby="relatedTitle">
      <div className={clsx('container', styles.relatedInner)}>
        <div className={styles.relatedHead}>
          <h3 className={styles.relatedTitle} id="relatedTitle">
            관련 사이트
          </h3>
          <div className={styles.relatedControls}>
            <IconButton icon="left" label="이전" size="xs" onClick={rolling.prev} />
            <IconButton
              icon={rolling.paused ? 'play' : 'pause'}
              label={rolling.paused ? '롤링 재생' : '롤링 정지'}
              size="xs"
              aria-pressed={rolling.paused}
              onClick={rolling.togglePause}
            />
            <IconButton icon="right" label="다음" size="xs" onClick={rolling.next} />
          </div>
        </div>
        <div className={styles.relatedViewport}>
          <ul className={styles.relatedTrack} ref={rolling.trackRef} style={{ transform: `translateX(${rolling.translate}px)` }}>
            {SITES.map((name, i) => (
              <li key={name} className={styles.relatedItem} onFocus={() => rolling.onFocusItem(i)}>
                <a href="#" target="_blank" rel="noopener" title="새 창 열림">
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
