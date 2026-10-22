import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Icon } from '@/components/Icon';
import { useFontSize, useGnbMegaMenu, useHeaderSearch, useIsMobile } from '@/hooks';
import { useRouteHandle } from '@/app/useRouteHandle';
import { useAllMenu } from '@/app/AllMenuContext';
import Gnb from './Gnb';
import { useAuthLinks } from './useAuthLinks';
import styles from './Header.module.scss';

/** 헤더: 유틸리티 바 + GNB 메가메뉴 + 통합검색. 전체메뉴 다이얼로그는 AllMenuProvider가 소유한다. */
export default function Header() {
  const handle = useRouteHandle();
  const mega = useGnbMegaMenu();
  const allmenu = useAllMenu();
  const search = useHeaderSearch<HTMLInputElement, HTMLButtonElement>();
  const fontSize = useFontSize();
  // 모바일은 입력창이 좁아 안내문을 짧게 보여 준다
  const isMobile = useIsMobile();
  const { user, loginHref, onSignOut } = useAuthLinks();

  return (
    <>
      <div className={clsx('skip-nav', styles.skipNav)}>
        <a href="#content">본문 바로가기</a>
        <a href="#gnb">주메뉴 바로가기</a>
      </div>

      <header className={clsx(styles.header, mega.isOpen && styles.isGnbOpen)}>
        <div className={styles.utilBar}>
          <div className={clsx('container', styles.utilBarInner)}>
            <p className={styles.utilBarOfficial}>
              <svg className={styles.utilBarBadge} viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="8" cy="8" r="8" fill="currentColor" />
                <path d="M4.5 8.2l2.3 2.2 4.7-4.8" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              이 누리집은 에너지전환진흥원 공식 누리집입니다.
            </p>
            <ul className={styles.utilBarLinks}>
              {user ? (
                <>
                  <li className={styles.utilBarUser}>
                    <strong>{user.name}</strong>님
                  </li>
                  <li>
                    <Link to="/support/qna/mine">내 질문</Link>
                  </li>
                  <li>
                    <button type="button" onClick={onSignOut}>
                      로그아웃
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to={loginHref}>로그인</Link>
                  </li>
                  <li>
                    <Link to="/signup">회원가입</Link>
                  </li>
                </>
              )}
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    allmenu.open(e.currentTarget);
                  }}
                >
                  사이트맵
                </a>
              </li>
              <li>
                <div className={styles.fontSize} role="group" aria-labelledby="fontSizeLabel">
                  <span id="fontSizeLabel">글자크기</span>
                  <button type="button" className={styles.fontSizeBtn} disabled={!fontSize.canDown} onClick={() => fontSize.change('down')}>
                    <Icon name="minus" />
                    <span className="sr-only">글자 작게</span>
                  </button>
                  <button type="button" className={styles.fontSizeBtn} disabled={!fontSize.canUp} onClick={() => fontSize.change('up')}>
                    <Icon name="plus" />
                    <span className="sr-only">글자 크게</span>
                  </button>
                  <output className="sr-only" aria-live="polite">
                    {fontSize.announcement}
                  </output>
                </div>
              </li>
              <li>
                <a href="#" lang="en" className={styles.utilBarEn}>
                  ENGLISH
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.headerBar}>
          <div className={clsx('container', styles.headerInner)}>
            <h1 className={styles.logo}>
              <Link to="/">
                <svg className={styles.logoMark} viewBox="0 0 36 36" aria-hidden="true">
                  <rect width="36" height="36" rx="10" fill="#1D5BD8" />
                  <path d="M8 22c4-7 9-9 20-9-3 7-8 11-14 11-2 0-4-.6-6-2z" fill="#3FD6A4" />
                  <path d="M8 26c5-4 10-6 17-7" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
                <span className={styles.logoText}>
                  <strong>에너지전환진흥원</strong>
                  <span lang="en">Korea Energy Transition Agency</span>
                </span>
              </Link>
            </h1>

            <Gnb currentGnbId={handle?.gnbId} currentLnbId={handle?.lnbId} mega={mega} />

            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.headerSearchBtn}
                aria-expanded={search.open}
                aria-controls="headerSearch"
                onClick={search.toggle}
                ref={search.buttonRef}
              >
                <Icon name="search" />
                <span className="sr-only">통합검색 {search.open ? '닫기' : '열기'}</span>
              </button>
              <button
                type="button"
                className={styles.headerMenuBtn}
                aria-haspopup="dialog"
                aria-controls="allmenu"
                onClick={(e) => allmenu.open(e.currentTarget)}
              >
                <Icon name="menu" />
                <span className={styles.headerMenuLabel}>전체메뉴</span>
              </button>
            </div>
          </div>

          <div
            className={styles.headerSearch}
            id="headerSearch"
            hidden={!search.open}
            onKeyDown={(e) => e.key === 'Escape' && search.close()}
          >
            <form className={clsx('container', styles.headerSearchInner)} action="#" role="search">
              <label htmlFor="headerSearchInput" className="sr-only">
                통합검색어
              </label>
              <input
                type="search"
                id="headerSearchInput"
                className={styles.headerSearchInputEl}
                placeholder={isMobile ? '사업·서비스 검색' : '궁금한 사업이나 서비스를 검색해 보세요'}
                ref={search.inputRef}
              />
              <button type="submit" className={styles.headerSearchSubmit}>
                <Icon name="search" />
                <span className="sr-only">검색</span>
              </button>
            </form>
          </div>
        </div>
        <div className={styles.gnbDim} aria-hidden="true" onClick={mega.close} />
      </header>
    </>
  );
}
