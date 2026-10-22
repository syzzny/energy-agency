import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { useToast } from '@/components/Toast';
import { formStyles as f } from '@/components/Form';
import { safeNext, useAuth } from '@/auth';
import { authErrorMessage } from '@/api/auth';
import { PasswordField } from './PasswordField';
import { PasswordGrade, passwordRules } from './PasswordGrade';
import { AuthShell } from './AuthShell';
import styles from './AuthPage.module.scss';

type Field = 'name' | 'email' | 'password' | 'passwordConfirm' | 'agree';
type Errors = Partial<Record<Field, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ORDER: Field[] = ['name', 'email', 'password', 'passwordConfirm', 'agree'];
const fid = (name: Field) => `signup-${name}`;


function validate(v: { name: string; email: string; password: string; passwordConfirm: string; agree: boolean }): Errors {
  const errors: Errors = {};
  const name = v.name.trim();
  if (name.length < 2 || name.length > 20) errors.name = '이름을 2~20자로 입력해 주세요.';
  if (!EMAIL.test(v.email.trim())) errors.email = '이메일 주소를 정확히 입력해 주세요.';
  if (!passwordRules(v.password).every((r) => r.ok)) errors.password = '영문과 숫자를 섞어 8자 이상으로 입력해 주세요.';
  if (!errors.password && v.password !== v.passwordConfirm) errors.passwordConfirm = '비밀번호가 서로 달라요.';
  if (!v.agree) errors.agree = '개인정보 수집·이용에 동의해 주세요.';
  return errors;
}

export default function SignupPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [params] = useSearchParams();
  const next = safeNext(params.get('next'));

  const [values, setValues] = useState({ name: '', email: '', password: '', passwordConfirm: '', agree: false });
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState('');
  const [pending, setPending] = useState(false);
  const [sentTo, setSentTo] = useState('');

  if (auth.status === 'authenticated' && !pending) return <Navigate to={next} replace />;

  const set = <K extends keyof typeof values>(key: K, value: (typeof values)[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key as Field]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (pending) return;
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setServerError('');
    const first = ORDER.find((k) => nextErrors[k]);
    if (first) {
      document.getElementById(fid(first))?.focus();
      return;
    }
    setPending(true);
    try {
      const { needsConfirm } = await auth.signUp({ name: values.name, email: values.email, password: values.password });
      if (needsConfirm) {
        setSentTo(values.email.trim());
        setPending(false);
        return;
      }
      toast.show(`${values.name.trim()}님, 가입을 환영해요!`);
      navigate(next, { replace: true });
    } catch (err) {
      setServerError(authErrorMessage(err));
      setPending(false);
    }
  };

  const err = (name: Field) => ({
    'aria-invalid': errors[name] ? ('true' as const) : undefined,
    'aria-errormessage': errors[name] ? `${fid(name)}-err` : undefined,
  });
  const errText = (name: Field) =>
    errors[name] && (
      <p className={clsx(f.fieldHelp, f.fieldHelpError)} id={`${fid(name)}-err`}>
        {errors[name]}
      </p>
    );

  if (sentTo) {
    return (
      <AuthShell variant="signup" title="인증 메일을 보냈어요" desc="메일의 링크를 누르면 가입이 끝나요.">
        <div className={styles.done} role="status">
          <p>
            <strong>{sentTo}</strong> 으로 인증 메일을 보냈어요. 메일이 보이지 않으면 스팸함도 확인해 주세요.
          </p>
          <Button href="/login" variant="line" size="lg">
            로그인 화면으로
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      variant="signup"
      title="회원가입"
      desc="회원이 되면 질문 등록 때 이름이 자동으로 들어가고, 비공개 질문의 답변도 다시 볼 수 있어요."
     
      foot={
        <>
          이미 회원이신가요?
          <Link to={`/login${params.get('next') ? `?next=${encodeURIComponent(next)}` : ''}`}>로그인</Link>
        </>
      }
    >
      <form className={styles.form} noValidate onSubmit={onSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={fid('name')}>
            이름
          </label>
          <div className={styles.control}>
            <Icon name="users" className={styles.controlIcon} />
            <input id={fid('name')} className={f.input} autoComplete="name" maxLength={20} placeholder="홍길동" value={values.name} onChange={(e) => set('name', e.target.value)} {...err('name')} />
          </div>
          {errText('name')}
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={fid('email')}>
            이메일
          </label>
          <div className={styles.control}>
            <Icon name="mail" className={styles.controlIcon} />
            <input
              id={fid('email')}
              type="email"
              className={f.input}
              autoComplete="email"
              inputMode="email"
              placeholder="name@example.com"
              value={values.email}
              onChange={(e) => set('email', e.target.value)}
              {...err('email')}
            />
          </div>
          {errText('email')}
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={fid('password')}>
            비밀번호
          </label>
          <PasswordField
            id={fid('password')}
            autoComplete="new-password"
            value={values.password}
            onChange={(e) => set('password', e.target.value)}
            aria-describedby="signup-password-grade"
            {...err('password')}
          />
          <PasswordGrade password={values.password} id="signup-password-grade" />
          {errText('password')}
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={fid('passwordConfirm')}>
            비밀번호 확인
          </label>
          <PasswordField
            id={fid('passwordConfirm')}
            autoComplete="new-password"
            value={values.passwordConfirm}
            onChange={(e) => set('passwordConfirm', e.target.value)}
            {...err('passwordConfirm')}
          />
          {errText('passwordConfirm') ??
            (values.passwordConfirm && values.passwordConfirm === values.password && (
              <p className={clsx(f.fieldHelp, styles.match)}>
                <Icon name="check" /> 비밀번호가 같아요
              </p>
            ))}
        </div>

        <div className={styles.field}>
          <label className={f.checkbox}>
            <input type="checkbox" id={fid('agree')} checked={values.agree} onChange={(e) => set('agree', e.target.checked)} {...err('agree')} />
            <span className={f.checkboxMark} />
            [필수] 개인정보 수집·이용 동의 (이름, 이메일을 회원 탈퇴 시까지 보관)
          </label>
          {errText('agree')}
        </div>

        {serverError && (
          <p className={styles.alert} role="alert">
            <Icon name="info" />
            {serverError}
          </p>
        )}

        <Button type="submit" size="lg" className={styles.submit} disabled={pending} aria-busy={pending || undefined}>
          {pending ? '가입하는 중…' : '가입하기'}
        </Button>
      </form>
    </AuthShell>
  );
}
