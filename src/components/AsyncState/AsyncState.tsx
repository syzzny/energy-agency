import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';
import styles from './AsyncState.module.scss';

/**
 * 서버 데이터를 기다리거나 실패했을 때의 화면
 * - StateMessage: 빈 결과 · 오류 · 설정 안내 (다시 시도 버튼 등 action 을 붙일 수 있다)
 * - TableSkeleton: 표 모양 그대로 회색 막대를 보여 줘 레이아웃이 튀지 않게 한다
 */
export function StateMessage({
  variant,
  title,
  desc,
  action,
}: {
  variant: 'empty' | 'error';
  title: string;
  desc?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className={styles.message} role={variant === 'error' ? 'alert' : undefined}>
      <span className={styles.icon} data-variant={variant} aria-hidden="true">
        <Icon name={variant === 'error' ? 'info' : 'search'} />
      </span>
      <p className={styles.title}>{title}</p>
      {desc && <p className={styles.desc}>{desc}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

/** 표 안에서 한 줄 전체를 차지하는 칸 (빈 결과 · 오류 메시지용) */
export function TableMessageRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr className={styles.messageRow}>
      <td colSpan={colSpan}>{children}</td>
    </tr>
  );
}

/** 불러오는 동안 보여 줄 표 줄 (스크린리더에는 숨기고, 표에 aria-busy 를 건다) */
export function TableSkeleton({ rows = 5, cols }: { rows?: number; cols: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, r) => (
        <tr key={r} className={styles.skeletonRow} aria-hidden="true">
          {Array.from({ length: cols }, (_, c) => (
            <td key={c}>
              <span className={styles.bar} style={{ width: c === 1 ? `${60 + ((r * 13) % 30)}%` : '60%' }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/** 상세 글을 불러오는 동안의 자리 표시 */
export function ArticleSkeleton() {
  return (
    <div className={styles.articleSkeleton} aria-hidden="true">
      <span className={styles.bar} style={{ width: '18%' }} />
      <span className={styles.bar} style={{ width: '72%', height: 28 }} />
      <span className={styles.bar} style={{ width: '40%' }} />
      <span className={styles.bar} style={{ width: '100%', height: 120 }} />
    </div>
  );
}
