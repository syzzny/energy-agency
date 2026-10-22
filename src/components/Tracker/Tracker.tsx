import clsx from 'clsx';
import { Icon } from '@/components/Icon';
import styles from './Tracker.module.scss';

export interface TrackerStep {
  label: string;
  status: 'done' | 'current' | 'wait';
  time?: string;
  timeLabel?: string;
}

export function Tracker({ steps }: { steps: TrackerStep[] }) {
  return (
    <ol className={styles.tracker} aria-label="처리 단계">
      {steps.map((step) => (
        <li
          key={step.label}
          className={clsx(styles.step, step.status === 'done' && styles.done, step.status === 'current' && styles.current, step.status === 'wait' && styles.wait)}
          aria-current={step.status === 'current' ? 'step' : undefined}
        >
          <span className={styles.dot}>
            <Icon name={step.status === 'done' ? 'check' : step.status === 'current' ? 'clock' : 'flag'} />
          </span>
          <strong>
            {step.label} {step.status === 'done' && <span className="sr-only">(완료)</span>}
          </strong>
          {step.time ? <time dateTime={step.time}>{step.timeLabel}</time> : <small>{step.status === 'current' ? '현재 단계' : '예정'}</small>}
        </li>
      ))}
    </ol>
  );
}
