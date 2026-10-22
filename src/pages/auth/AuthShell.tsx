import type { ReactNode } from 'react';
import clsx from 'clsx';
import { artProps, photoProps } from '@/utils/asset';
import styles from './AuthPage.module.scss';

/** 에너지소비효율등급 5색 — 카드뉴스 · 비밀번호 등급과 같은 색 */
const GRADE = ['#00a651', '#8cc63f', '#f2c500', '#f7941d', '#e5352c'];

export interface AuthShellProps {
  /** login: 남색 사진 패널 + 폼, 두 칸 — 다시 찾아온 회원을 차분하게 맞이
   *  signup: 한 장짜리 밝은 카드 + 위쪽 효율등급 띠 + 3D 일러스트 — 처음 오는 사람을 반갑게 */
  variant: 'login' | 'signup';
  title: string;
  desc: ReactNode;
  /** 로그인 사진 패널의 문구 */
  panelTitle?: ReactNode;
  /** 로그인 사진 패널의 보조 문장 */
  panelDesc?: ReactNode;
  children: ReactNode;
  foot?: ReactNode;
}

export function AuthShell({ variant, title, desc, panelTitle, panelDesc, children, foot }: AuthShellProps) {
  const isSignup = variant === 'signup';
  return (
    <main id="content" tabIndex={-1} className={clsx(styles.page, isSignup && styles.pageSignup)}>
      <div className={styles.inner}>
        <div className={clsx(styles.shell, isSignup && styles.shellSignup)}>
          {isSignup ? (
            <div className={styles.signupBand} aria-hidden="true">
              {GRADE.map((c) => (
                <span key={c} style={{ background: c }} />
              ))}
            </div>
          ) : (
            <aside className={styles.panel}>
              <img className={styles.panelBg} {...photoProps('photo-green-building', '(max-width: 1023px) 100vw, 1300px')} alt="" width={1376} height={768} />
              <p className={styles.panelTitle}>{panelTitle}</p>
              {panelDesc && <p className={styles.panelDesc}>{panelDesc}</p>}
            </aside>
          )}

          <section className={styles.body} aria-labelledby="authTitle">
            <header className={styles.head}>
              <div>
                <h2 id="authTitle">{title}</h2>
                <p>{desc}</p>
              </div>
              {isSignup && <img className={styles.headArt} {...artProps('3d-house', '96px')} alt="" width={480} height={480} />}
            </header>
            {children}
            {foot && <p className={styles.foot}>{foot}</p>}
          </section>
        </div>
      </div>
    </main>
  );
}
