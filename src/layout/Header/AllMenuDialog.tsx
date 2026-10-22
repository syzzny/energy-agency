import type { RefObject } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { menu } from '@/data/menu';
import { menuPath } from '@/utils/menu';
import { Icon } from '@/components/Icon';
import { useAuthLinks } from './useAuthLinks';
import styles from './Header.module.scss';

export interface AllMenuDialogProps {
  dialogRef: RefObject<HTMLDivElement>;
  isOpen: boolean;
  onClose: () => void;
  currentGnbId?: string | null;
  currentLnbId?: string | null;
}

/** 전체메뉴(사이트맵/모바일 드로어) — `partials/header.hbs`의 `#allmenu` 대응 */
export default function AllMenuDialog({ dialogRef, isOpen, onClose, currentGnbId, currentLnbId }: AllMenuDialogProps) {
  const [openGnbId, setOpenGnbId] = useState<string | null>(currentGnbId ?? null);
  const { user, loginHref, onSignOut } = useAuthLinks();

  return (
    <div
      className={styles.allmenu}
      id="allmenu"
      role="dialog"
      aria-modal="true"
      aria-labelledby="allmenuTitle"
      hidden={!isOpen}
      ref={dialogRef}
    >
      <div className={styles.allmenuInner}>
        <div className={styles.allmenuHead}>
          <h2 id="allmenuTitle" className={styles.allmenuHeading}>
            전체메뉴
          </h2>
          <div className={styles.allmenuMoUtil}>
            {user ? (
              <>
                <Link to="/support/qna/mine" onClick={onClose}>
                  {user.name}님 · 내 질문
                </Link>
                <button type="button" onClick={() => (onClose(), onSignOut())}>
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to={loginHref} onClick={onClose}>
                  로그인
                </Link>
                <Link to="/signup" onClick={onClose}>
                  회원가입
                </Link>
              </>
            )}
            <a href="#" lang="en">
              ENGLISH
            </a>
          </div>
          <button type="button" className={styles.allmenuClose} onClick={onClose}>
            <Icon name="close" />
            <span className="sr-only">전체메뉴 닫기</span>
          </button>
        </div>
        <ul className={styles.allmenuList}>
          {menu.map((m) => {
            const isOpenItem = m.id === openGnbId;
            return (
              <li key={m.id} className={clsx(styles.allmenuItem, isOpenItem && styles.isOpen)}>
                <strong className={styles.allmenuTitle}>{m.name}</strong>
                <button
                  type="button"
                  className={styles.allmenuToggle}
                  aria-expanded={isOpenItem}
                  aria-controls={`allmenu-${m.id}`}
                  onClick={() => setOpenGnbId(isOpenItem ? null : m.id)}
                >
                  {m.name}
                  <Icon name="down" />
                </button>
                {/* PC: 6개 메뉴의 하위 항목이 모두 펼쳐진 사이트맵 / 모바일: 아코디언 (닫힘은 CSS 에서 .isOpen 으로 제어) */}
                <ul className={styles.allmenuSub} id={`allmenu-${m.id}`}>
                  {m.children.map((c) => (
                    <li key={c.id}>
                      <Link
                        to={menuPath(m.id, c.id)}
                        onClick={onClose}
                        className={clsx(m.id === currentGnbId && c.id === currentLnbId && styles.isCurrent)}
                        aria-current={m.id === currentGnbId && c.id === currentLnbId ? 'page' : undefined}
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
