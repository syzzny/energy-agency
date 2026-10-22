import { Fragment } from 'react';
import clsx from 'clsx';
import { Icon } from '@/components/Icon';
import styles from './Stepper.module.scss';

export interface StepperStep {
  label: string;
  en: string;
}

export function Stepper({ steps, currentIndex }: { steps: StepperStep[]; currentIndex: number }) {
  return (
    <ol className={styles.stepper} aria-label="신청 단계">
      {steps.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <Fragment key={step.label}>
            {i > 0 && <li className={clsx(styles.line, isDone && styles.lineDone)} aria-hidden="true" />}
            <li className={clsx(styles.item, isDone && styles.done)} aria-current={isCurrent ? 'step' : undefined}>
              <span className={clsx(styles.num, isCurrent && styles.current)}>
                {isDone ? <Icon name="check" /> : <span className="num">{i + 1}</span>}
              </span>
              <span className={styles.text}>
                <small lang="en">{step.en}</small>
                <strong>
                  {step.label} {isDone && <span className="sr-only">(완료)</span>}
                  {isCurrent && <span className="sr-only">(현재 단계)</span>}
                </strong>
              </span>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
