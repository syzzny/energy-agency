import styles from './Article.module.scss';

/** 본문 사진 — 16:9 로 잘라 보여준다. 내용이 있는 사진이므로 alt 를 꼭 넘긴다. */
export function Figure({ src, srcSet, sizes, alt, caption }: { src: string; srcSet?: string; sizes?: string; alt: string; caption: string }) {
  return (
    <figure className={styles.figure}>
      <div className={styles.figureThumb}>
        <img src={src} srcSet={srcSet} sizes={sizes} alt={alt} width={1376} height={768} />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
