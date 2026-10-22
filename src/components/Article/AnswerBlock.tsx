import type { ReactNode } from 'react';
import { isoDate } from '@/utils/date';
import styles from './Article.module.scss';

export function AnswerBlock({ dept, date, children }: { dept: string; date: string; children: ReactNode }) {
  return (
    <section className={styles.answer} aria-labelledby="answerTitle">
      <div className={styles.answerHead}>
        <span className={styles.answerA} aria-hidden="true">
          A
        </span>
        <h4 id="answerTitle">답변</h4>
        <p className={styles.answerMeta}>
          {dept} · <time dateTime={isoDate(date)} className="num">{date}</time>
        </p>
      </div>
      <div className={styles.answerBody}>{children}</div>
    </section>
  );
}
