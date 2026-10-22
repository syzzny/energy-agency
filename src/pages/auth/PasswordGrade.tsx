import clsx from 'clsx';
import { Icon } from '@/components/Icon';
import styles from './AuthPage.module.scss';

/** 에너지소비효율등급 라벨과 같은 5단계 색 (카드뉴스 등급 막대와 동일) */
const COLORS = ['#00a651', '#8cc63f', '#f2c500', '#f7941d', '#e5352c'];
const LABELS = ['아주 안전해요', '안전해요', '보통이에요', '약해요', '매우 약해요'];

/** 1등급(가장 안전) ~ 5등급 */
export function passwordGrade(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Za-z]/.test(pw) && /\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  return 5 - Math.min(4, score);
}

export const passwordRules = (pw: string) => [
  { label: '영문', ok: /[A-Za-z]/.test(pw) },
  { label: '숫자', ok: /\d/.test(pw) },
  { label: '8자 이상', ok: pw.length >= 8 },
];

/**
 * 비밀번호 안전 등급 — 효율등급 라벨처럼 1~5등급 색 막대 위에 지금 등급을 ▼ 로 가리킨다
 * 등급 문장은 스크린리더에도 읽힌다(aria-live). 색만으로 전달하지 않도록 숫자 등급을 글자로 함께 쓴다.
 */
export function PasswordGrade({ password, id }: { password: string; id: string }) {
  const grade = password ? passwordGrade(password) : 0;
  return (
    <div className={styles.grade} id={id}>
      <div className={styles.gradeScale} aria-hidden="true">
        {COLORS.map((color, i) => (
          <span key={color} className={clsx(i + 1 === grade && styles.gradeOn)} style={{ background: color }}>
            {i + 1}
          </span>
        ))}
      </div>
      <div className={styles.gradeInfo}>
        <p className={styles.gradeText} aria-live="polite">
          {grade ? (
            <>
              안전 등급 <strong>{grade}등급</strong> {LABELS[grade - 1]}
            </>
          ) : (
            '입력하면 안전 등급을 알려 드려요'
          )}
        </p>
        <ul className={styles.rules}>
          {passwordRules(password).map((r) => (
            <li key={r.label} className={clsx(r.ok && styles.ruleOk)}>
              <Icon name="check" />
              {r.label}
              <span className="sr-only">{r.ok ? ' 충족' : ' 미충족'}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
