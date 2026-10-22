import styles from './Steps.module.scss';

export interface StepItem {
  title: string;
  desc: string;
}

export function Steps({ items }: { items: StepItem[] }) {
  return (
    <ol className={styles.steps}>
      {items.map((item, i) => (
        <li key={item.title} className={styles.item}>
          <span className={styles.num} aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div>
            <strong>{item.title}</strong>
            <p>{item.desc}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
