import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Icon } from '@/components/Icon';
import { useDropdown, useTopButton } from '@/hooks';
import styles from './Footer.module.scss';

const FAMILY_SITES = ['탄소중립 정책포털', '재생에너지 클라우드', '에너지 통계 플랫폼', '녹색건축 인증센터'];

export default function Footer() {
  const family = useDropdown<HTMLDivElement>();
  const top = useTopButton();

  return (
    <>
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerTop}>
            <ul className={styles.footerLinks}>
              <li>
                <Link to="/policy#privacy" className={styles.footerPrivacy}>
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link to="/policy#terms">이용약관</Link>
              </li>
              <li>
                <Link to="/policy#copyright">저작권정책</Link>
              </li>
              <li>
                <Link to="/policy#email">이메일무단수집거부</Link>
              </li>
              <li>
                <Link to="/policy#cctv">영상정보처리기기 운영방침</Link>
              </li>
              <li>
                <Link to="/support/location">찾아오시는 길</Link>
              </li>
            </ul>
            <div className={styles.familySite} ref={family.wrapRef} onBlur={family.onBlur} onKeyDown={family.onKeyDown}>
              <button
                type="button"
                className={styles.familySiteBtn}
                aria-expanded={family.open}
                aria-controls="familySiteList"
                onClick={family.toggle}
                ref={family.buttonRef}
              >
                패밀리사이트
                <Icon name="down" />
              </button>
              <ul className={styles.familySiteList} id="familySiteList" hidden={!family.open}>
                {FAMILY_SITES.map((name) => (
                  <li key={name}>
                    <a href="#" target="_blank" rel="noopener" title="새 창 열림">
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <div className={styles.footerInfo}>
              <p className={styles.footerLogo}>
                <svg viewBox="0 0 36 36" aria-hidden="true">
                  <rect width="36" height="36" rx="10" fill="#fff" fillOpacity=".1" />
                  <path d="M8 22c4-7 9-9 20-9-3 7-8 11-14 11-2 0-4-.6-6-2z" fill="#3FD6A4" />
                  <path d="M8 26c5-4 10-6 17-7" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
                에너지전환진흥원
              </p>
              <address>
                <p>(48058) 부산광역시 해운대구 센텀중앙로 00, 에너지전환진흥원</p>
                <p>
                  <span>
                    대표전화 <a href="tel:1600-0000" className="num">1600-0000</a>
                  </span>{' '}
                  <span>
                    팩스 <span className="num">051-000-0000</span>
                  </span>{' '}
                  <span>
                    사업자등록번호 <span className="num">000-00-00000</span>
                  </span>
                </p>
              </address>
              <p className={styles.footerCopy} lang="en">
                © 2026 Korea Energy Transition Agency. All rights reserved.
              </p>
            </div>
            <div className={styles.footerSide}>
              <ul className={styles.footerSns}>
                <li>
                  <a href="#" target="_blank" rel="noopener">
                    <Icon name="youtube" />
                    <span className="sr-only">유튜브 (새 창 열림)</span>
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener">
                    <Icon name="instagram" />
                    <span className="sr-only">인스타그램 (새 창 열림)</span>
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener">
                    <Icon name="blog" />
                    <span className="sr-only">블로그 (새 창 열림)</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <button type="button" className={clsx(styles.topBtn, 'no-print')} hidden={!top.visible} onClick={top.scrollToTop}>
        <Icon name="up" />
        <span className="sr-only">맨 위로</span>
      </button>
    </>
  );
}
