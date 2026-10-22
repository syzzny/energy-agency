import { type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { menu } from '@/data/menu';
import type { GnbMegaMenu } from '@/hooks/useGnbMegaMenu';
import { menuPath } from '@/utils/menu';
import styles from './Header.module.scss';

export interface GnbProps {
  currentGnbId?: string | null;
  currentLnbId?: string | null;
  /** 열림 상태는 Header 가 소유 (헤더 클래스 · 배경 dim 과 공유) */
  mega: GnbMegaMenu;
}

/**
 * GNB 메가메뉴 — 1depth 하나에 hover/focus 하면 2depth 전체(6개 컬럼)가 한 패널에 펼쳐지고,
 * 가리킨 메뉴의 컬럼만 배경색으로 강조된다. (데스크톱 전용)
 */
export default function Gnb({ currentGnbId, currentLnbId, mega }: GnbProps) {
  return (
    <nav
      ref={mega.navRef}
      className={styles.gnb}
      id="gnb"
      aria-label="주메뉴"
      // 컬럼 + 패널 전체가 nav 안에 있으므로, 패널 빈 공간으로 이동해도 닫히지 않는다
      onMouseEnter={mega.onNavMouseEnter}
      onMouseLeave={mega.onNavMouseLeave}
      onBlur={mega.onNavBlur}
    >
      <ul className={styles.gnbList}>
        {menu.map((m, i) => {
          const isCurrentTop = m.id === currentGnbId;
          const isHover = m.id === mega.openId;
          return (
            <li
              key={m.id}
              className={clsx(styles.gnbItem, isCurrentTop && styles.isCurrent, isHover && styles.isHover)}
              style={{ '--i': i } as CSSProperties}
              onMouseEnter={() => mega.onItemEnter(m.id)}
              onFocus={() => mega.onItemFocus(m.id)}
            >
              <Link
                to={menuPath(m.id, m.children[0].id)}
                className={styles.gnbLink}
                data-gnb-link={m.id}
                aria-current={isCurrentTop ? 'true' : undefined}
              >
                {m.name}
              </Link>
              <div className={styles.gnbCol}>
                <strong className={styles.gnbColTitle} aria-hidden="true">
                  {m.name}
                </strong>
                <ul className={styles.gnbSub}>
                  {m.children.map((c) => (
                    <li key={c.id}>
                      <Link
                        to={menuPath(m.id, c.id)}
                        className={clsx(m.id === currentGnbId && c.id === currentLnbId && styles.isCurrent)}
                        aria-current={m.id === currentGnbId && c.id === currentLnbId ? 'page' : undefined}
                        onClick={mega.close}
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
      <div className={styles.gnbPanel} aria-hidden="true">
        <div className={styles.gnbIntro}>
          <strong>에너지전환진흥원</strong>
          <p>
            국민이 체감하는 에너지전환,
            <br />
            필요한 메뉴를 바로 찾아보세요.
          </p>
        </div>
      </div>
    </nav>
  );
}
