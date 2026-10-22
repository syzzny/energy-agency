import clsx from 'clsx';
import { Icon } from '@/components/Icon';
import { stats } from '@/data/stats';
import { imageUrl } from '@/utils/asset';
import { Button } from '@/components/Button';
import { Eyebrow } from '@/components/Heading';
import styles from './HomePage.module.scss';

export default function StatsSection() {
  return (
    <section className={styles.stats} aria-labelledby="statsTitle">
      <div className={clsx('container', styles.statsInner)}>
        <div className={styles.statsCopy}>
          <Eyebrow>숫자로 보는 에너지전환</Eyebrow>
          <h3 className={styles.statsTitle} id="statsTitle">
            국민과 함께 만든
            <br />
            에너지전환의 성과
          </h3>
          <p className={styles.statsDesc}>
            지역 곳곳의 태양광·풍력 설비부터 취약계층 에너지 지원까지, 에너지전환진흥원의 사업이 만든 변화를 데이터로 확인하세요.
          </p>
          <Button href="/info/disclosure" variant="dark" pill icon="arrow">
            사전정보공표 바로가기
          </Button>
          <p className={styles.statsNote}>※ 2025년 12월 말 기준, 기관 내부 집계</p>
          <img className={styles.statsImg} src={imageUrl('3d-globe')} alt="" width={480} height={480} loading="lazy" />
        </div>
        <ul className={styles.statsGrid}>
          {stats.map((s) => (
            <li key={s.label} className={clsx(styles.statCard, s.highlight && styles.highlight)}>
              <p className={styles.statCardHead}>
                {s.label}
                <span className={styles.statCardIcon} aria-hidden="true">
                  <Icon name={s.icon} />
                </span>
              </p>
              <p className={styles.statCardValue}>
                <strong>{s.value}</strong>
                <span>{s.unit}</span>
              </p>
              <p className={styles.statCardDesc}>{s.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
