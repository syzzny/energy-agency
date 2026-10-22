import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { useToast } from '@/components/Toast';
import { formStyles as f } from '@/components/Form';
import { safeNext, useAuth } from '@/auth';
import { authErrorMessage } from '@/api/auth';
import { PasswordField } from './PasswordField';
import { EMAIL_PATTERN } from '@/utils/validation';
import { AuthShell } from './AuthShell';
import styles from './AuthPage.module.scss';

const SAVED_EMAIL = 'ea-saved-email';


const readSaved = () => {
  try {
    return localStorage.getItem(SAVED_EMAIL) ?? '';
  } catch {
    return '';
  }
};

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [params] = useSearchParams();
  const next = safeNext(params.get('next'));

  const [email, setEmail] = useState(readSaved);
  const [remember, setRemember] = useState(() => Boolean(readSaved()));
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [invalid, setInvalid] = useState<'email' | 'password' | null>(null);
  const [pending, setPending] = useState(false);

  // 이미 로그인된 상태로 들어오면 돌아갈 곳으로
  if (auth.status === 'authenticated' && !pending) return <Navigate to={next} replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (pending) return;
    if (!EMAIL_PATTERN.test(email.trim())) {
      setInvalid('email');
      setError('이메일 주소를 정확히 입력해 주세요.');
      document.getElementById('loginEmail')?.focus();
      return;
    }
    if (!password) {
      setInvalid('password');
      setError('비밀번호를 입력해 주세요.');
      document.getElementById('loginPassword')?.focus();
      return;
    }
    setInvalid(null);
    setError('');
    setPending(true);
    try {
      await auth.signIn(email, password);
      try {
        if (remember) localStorage.setItem(SAVED_EMAIL, email.trim());
        else localStorage.removeItem(SAVED_EMAIL);
      } catch {
        /* 저장소를 쓸 수 없는 환경 */
      }
      toast.show('로그인되었어요.');
      navigate(next, { replace: true });
    } catch (err) {
      setError(authErrorMessage(err));
      setPending(false);
    }
  };

  return (
    <AuthShell
      variant="login"
      title="로그인"
      desc="가입한 이메일과 비밀번호를 입력해 주세요."
      panelTitle={
        <>
          깨끗한 에너지로
          <br />
          모두의 내일을 잇습니다
        </>
      }
      panelDesc="재생에너지 보급과 에너지 효율 혁신으로 국민 누구나 체감하는 탄소중립 사회를 앞당깁니다."
      foot={
        <>
          아직 회원이 아니신가요?
          <Link to={`/signup${params.get('next') ? `?next=${encodeURIComponent(next)}` : ''}`}>회원가입</Link>
        </>
      }
    >
      {params.get('verified') && !error && (
        <p className={styles.notice} role="status">
          <Icon name="check" />
          이메일 인증이 완료되었어요. 로그인해 주세요.
        </p>
      )}

      <form className={styles.form} noValidate onSubmit={onSubmit} aria-describedby={error ? 'loginError' : undefined}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="loginEmail">
            이메일
          </label>
          <div className={styles.control}>
            <Icon name="mail" className={styles.controlIcon} />
            <input
              id="loginEmail"
              type="email"
              className={f.input}
              autoComplete="email"
              inputMode="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={invalid === 'email' || undefined}
              required
            />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="loginPassword">
            비밀번호
          </label>
          <PasswordField
            id="loginPassword"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={invalid === 'password' || undefined}
            required
          />
        </div>

        <div className={styles.row}>
          <label className={f.checkbox}>
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <span className={f.checkboxMark} />
            이메일 저장
          </label>
        </div>

        {error && (
          <p className={styles.alert} id="loginError" role="alert">
            <Icon name="info" />
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className={styles.submit} disabled={pending} aria-busy={pending || undefined}>
          {pending ? '로그인 중…' : '로그인'}
        </Button>
      </form>
    </AuthShell>
  );
}
