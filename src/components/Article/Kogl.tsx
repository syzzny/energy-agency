import styles from './Article.module.scss';

export function Kogl() {
  return (
    <div className={styles.kogl}>
      <span className={styles.koglMark} aria-hidden="true">
        OPEN <em>공공누리</em>
      </span>
      <p>본 공공저작물은 공공누리 “제1유형: 출처표시” 조건에 따라 이용할 수 있습니다.</p>
    </div>
  );
}
