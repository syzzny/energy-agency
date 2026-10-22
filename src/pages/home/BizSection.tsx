import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { Eyebrow } from '@/components/Heading';
import { Button } from '@/components/Button';
import { business } from '@/data/business';
import { artProps } from '@/utils/asset';
import styles from './HomePage.module.scss';

export default function BizSection() {
  return (
    <section className={styles.biz} aria-labelledby="bizTitle">
      <div className="container">
        <div className={styles.bizHead}>
          <div>
            <Eyebrow>주요사업</Eyebrow>
            <h3 className={styles.bizTitle} id="bizTitle">
              생활 가까이에서 시작하는 에너지전환
            </h3>
          </div>
          <Button href="/business/solar" variant="line" pill icon="arrow">
            사업 전체보기
          </Button>
        </div>
        <ul className={styles.bizList}>
          {business.map((b) => (
            <li key={b.id} className={styles.bizCard}>
              <div>
                <span className={styles.bizCardVisual}>
                  <img className={styles.bizCardImg} {...artProps(b.card.img)} alt="" width={480} height={480} loading="lazy" />
                </span>
                <span className={styles.bizCardTag}>{b.card.tag}</span>
                <h4 className={styles.bizCardTitle}>
                  <Link to={`/business/${b.id}`}>{b.card.name}</Link>
                </h4>
                <p className={styles.bizCardDesc}>{b.card.summary}</p>
              </div>
              <p className={styles.bizCardFoot} aria-hidden="true">
                사업 안내
                <span className={styles.bizCardGo}>
                  <Icon name="arrow-up-right" />
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
