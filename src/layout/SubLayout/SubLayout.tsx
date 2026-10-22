import { Outlet, Link } from 'react-router-dom';
import clsx from 'clsx';
import { menu } from '@/data/menu';
import { depth1, depth2, menuPath } from '@/utils/menu';
import { imageUrl } from '@/utils/asset';
import { Icon } from '@/components/Icon';
import { usePageTools } from '@/hooks';
import { useRouteHandle } from '@/app/useRouteHandle';
import styles from './SubLayout.module.scss';

/**
 * 서브페이지 공통 레이아웃: breadcrumb + LNB + content(Outlet).
 * `partials/sub-layout.hbs` 대응 — 라우트 handle(gnbId/lnbId)로 depth1/depth2를 조회한다.
 */
export default function SubLayout() {
  const handle = useRouteHandle();
  const { share, print } = usePageTools();

  if (!handle) return <Outlet />;

  const top = depth1(menu, handle.gnbId);
  const current = depth2(menu, handle.gnbId, handle.lnbId ?? undefined);
  if (!top) return <Outlet />;

  const title = handle.title ?? current?.name ?? top.name;

  return (
    <main id="content" tabIndex={-1}>
      <div className={styles.subVisual}>
        <img className={styles.subVisualBg} src={imageUrl(top.visual)} alt="" width={1376} height={768} fetchPriority="high" />
        <div className={clsx('container', styles.subVisualInner)}>
          <nav className={styles.breadcrumb} aria-label="현재 위치">
            <ol>
              <li>
                <Link to="/">
                  <Icon name="home" />
                  <span className="sr-only">홈</span>
                </Link>
              </li>
              <li>
                <Link to={menuPath(top.id, top.children[0].id)}>{top.name}</Link>
              </li>
              <li aria-current="page">{current?.name ?? title}</li>
            </ol>
          </nav>
          <div className={styles.subVisualRow}>
            <h2 className={styles.subVisualTitle}>{title}</h2>
            <div className={clsx(styles.pageTools, 'no-print')}>
              <button type="button" className={styles.pageToolsBtn} onClick={share}>
                <Icon name="share" />
                <span className="sr-only">페이지 공유</span>
              </button>
              <button type="button" className={clsx(styles.pageToolsBtn, styles.pageToolsPrint)} onClick={print}>
                <Icon name="print" />
                <span className="sr-only">페이지 인쇄</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={clsx('container', styles.subBody)}>
        <nav className={clsx(styles.lnb, 'no-print')} aria-label={`${top.name} 하위메뉴`}>
          <h2 className={styles.lnbTitle}>{top.name}</h2>
          <ul className={styles.lnbList}>
            {top.children.map((c) => {
              const isCurrent = c.id === handle.lnbId;
              return (
                <li key={c.id}>
                  <Link to={menuPath(top.id, c.id)} className={clsx(styles.lnbLink, isCurrent && styles.isCurrent)} aria-current={isCurrent ? 'page' : undefined}>
                    {c.name}
                    <Icon name="right" />
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className={styles.lnbHelp}>
            <strong>도움이 필요하신가요?</strong>
            <p>
              고객센터 <a href="tel:1600-0000" className="num">1600-0000</a>
              <br />
              평일 09:00 ~ 18:00
            </p>
          </div>
        </nav>

        <div className={clsx(styles.content, handle.contentClass && styles[handle.contentClass])}>
          <Outlet />
        </div>
      </div>
    </main>
  );
}
