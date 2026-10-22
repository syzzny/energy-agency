import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { imageUrl, legacyRoute, multiline } from '@/utils';
import styles from './ProgramBanner.module.scss';

export interface ProgramBannerProps {
  image: string;
  badge: string;
  title: string;
  desc: string;
  cta: { label: string; href: string };
  guide: { label: string; file: string };
}

/** 사업 안내 배너(사진+오버레이) — `components/program-banner.hbs` 대응 */
export function ProgramBanner({ image, badge, title, desc, cta, guide }: ProgramBannerProps) {
  return (
    <div className={styles.banner}>
      <img className={styles.bg} src={imageUrl(image)} alt="" width={1376} height={768} />
      <div className={styles.copy}>
        <Badge label={badge} variant="glass" />
        <h3 className={styles.title}>{multiline(title)}</h3>
        <p className={styles.desc}>{multiline(desc)}</p>
      </div>
      <div className={styles.btns}>
        <Button href={legacyRoute(cta.href)} variant="white" pill icon="arrow">
          {cta.label}
        </Button>
        <Button href="#" variant="ghostWhite" pill icon="download" iconFirst download srText={`(${guide.file})`}>
          {guide.label}
        </Button>
      </div>
    </div>
  );
}
