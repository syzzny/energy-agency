/**
 * 입력 검사 규칙 — 화면과 분리해 두어 테스트하기 쉽게 하고, 같은 규칙을 여러 곳에서 쓴다.
 * 질문 등록 규칙은 DB 의 check 제약(supabase/*.sql)과 같은 값이어야 한다.
 */

// ---------- 비밀번호 ----------
/** 비밀번호 필수 조건 (회원가입) */
export const passwordRules = (pw: string) => [
  { label: '영문', ok: /[A-Za-z]/.test(pw) },
  { label: '숫자', ok: /\d/.test(pw) },
  { label: '8자 이상', ok: pw.length >= 8 },
];

/** 비밀번호 안전 등급: 1등급(가장 안전) ~ 5등급 — 에너지효율등급처럼 숫자가 작을수록 좋다 */
export function passwordGrade(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Za-z]/.test(pw) && /\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  return 5 - Math.min(4, score);
}

// ---------- 회원가입 ----------
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SignupField = 'name' | 'email' | 'password' | 'passwordConfirm' | 'agree';
export interface SignupValues {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  agree: boolean;
}

export function validateSignup(v: SignupValues): Partial<Record<SignupField, string>> {
  const errors: Partial<Record<SignupField, string>> = {};
  const name = v.name.trim();
  if (name.length < 2 || name.length > 20) errors.name = '이름을 2~20자로 입력해 주세요.';
  if (!EMAIL_PATTERN.test(v.email.trim())) errors.email = '이메일 주소를 정확히 입력해 주세요.';
  if (!passwordRules(v.password).every((r) => r.ok)) errors.password = '영문과 숫자를 섞어 8자 이상으로 입력해 주세요.';
  if (!errors.password && v.password !== v.passwordConfirm) errors.passwordConfirm = '비밀번호가 서로 달라요.';
  if (!v.agree) errors.agree = '개인정보 수집·이용에 동의해 주세요.';
  return errors;
}

// ---------- 질문 등록 ----------
/** DB check 제약과 같은 규칙 — 서버에 보내기 전에 먼저 걸러 준다 */
export const QNA_RULES = {
  writerName: { min: 2, max: 20, label: '이름' },
  title: { min: 2, max: 100, label: '제목' },
  content: { min: 5, max: 4000, label: '내용' },
} as const;

export type QnaField = keyof typeof QNA_RULES | 'agree';

export function validateQna(v: Record<keyof typeof QNA_RULES, string>, agree: boolean): Partial<Record<QnaField, string>> {
  const errors: Partial<Record<QnaField, string>> = {};
  (Object.keys(QNA_RULES) as (keyof typeof QNA_RULES)[]).forEach((key) => {
    const { min, max, label } = QNA_RULES[key];
    const len = v[key].trim().length;
    if (len === 0) errors[key] = `${label}을 입력해 주세요.`;
    else if (len < min || len > max) errors[key] = `${label}은 ${min}~${max.toLocaleString()}자로 입력해 주세요.`;
  });
  if (!agree) errors.agree = '개인정보 수집·이용에 동의해 주세요.';
  return errors;
}
