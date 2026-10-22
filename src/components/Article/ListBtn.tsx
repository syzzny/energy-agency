import { Button } from '@/components/Button';
import styles from './Article.module.scss';

export function ListBtn({ href, applyLabel, applyHref, applySr }: { href: string; applyLabel?: string; applyHref?: string; applySr?: string }) {
  return (
    <div className={styles.btnArea}>
      <Button href={href} variant="dark" size="lg" pill icon="list" iconFirst>
        목록으로
      </Button>
      {applyLabel && applyHref && (
        <Button href={applyHref} variant="primary" size="lg" pill icon="external" external srText={applySr}>
          {applyLabel}
        </Button>
      )}
    </div>
  );
}
