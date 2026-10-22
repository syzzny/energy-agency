import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Button } from '@/components/Button';
import { Heading } from '@/components/Heading';
import { useToast } from '@/components/Toast';
import { formStyles as f } from '@/components/Form';
import articleStyles from '@/components/Article/Article.module.scss';
import { createQna, errorMessage, maskName, type NewQna } from '@/api/qna';
import { useAuth } from '@/auth';
import { Link } from 'react-router-dom';

/** DB 의 check 제약과 같은 규칙 — 서버에 보내기 전에 먼저 걸러 준다 */
const RULES = {
  writerName: { min: 2, max: 20, label: '이름' },
  title: { min: 2, max: 100, label: '제목' },
  content: { min: 5, max: 4000, label: '내용' },
} as const;

type Field = keyof typeof RULES | 'agree';
type Errors = Partial<Record<Field, string>>;

function validate(v: NewQna, agree: boolean): Errors {
  const errors: Errors = {};
  (Object.keys(RULES) as (keyof typeof RULES)[]).forEach((key) => {
    const { min, max, label } = RULES[key];
    const len = v[key].trim().length;
    if (len === 0) errors[key] = `${label}을 입력해 주세요.`;
    else if (len < min || len > max) errors[key] = `${label}은 ${min}~${max.toLocaleString()}자로 입력해 주세요.`;
  });
  if (!agree) errors.agree = '개인정보 수집·이용에 동의해 주세요.';
  return errors;
}

const ORDER: Field[] = ['writerName', 'title', 'content', 'agree'];

/** 입력 칸 id — 본문 바로가기용 #content 등 페이지의 다른 id 와 겹치지 않도록 접두어를 붙인다 */
const fid = (name: Field | 'isPrivate') => `qna-${name}`;

/**
 * 질문 등록 — Supabase 에 실제로 저장한다
 * - 입력 검사는 DB 제약과 같은 규칙으로 먼저 하고, 첫 오류 칸으로 포커스를 옮긴다
 * - 보내는 동안 버튼을 막아 중복 등록을 방지하고, 성공하면 목록 캐시를 무효화한 뒤 목록으로 이동
 */
export default function QnaWritePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const { user } = useAuth();

  const [values, setValues] = useState<NewQna>({ writerName: user?.name.slice(0, 20) ?? '', title: '', content: '', isPrivate: false });

  // 로그인 정보가 늦게 확인되면(새로고침 직후) 그때 이름을 채운다
  useEffect(() => {
    if (user) setValues((prev) => ({ ...prev, writerName: user.name.slice(0, 20) }));
  }, [user]);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const mutation = useMutation({
    mutationFn: createQna,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['qna'] });
      // 등록 후에는 항상 전체 목록으로 (맨 위에 방금 쓴 글이 보인다)
      toast.show(user ? '질문이 등록되었어요. 상단의 내 질문에서도 모아 볼 수 있어요.' : '질문이 등록되었어요. 답변이 달리면 목록에서 확인할 수 있어요.');
      navigate('/support/qna');
    },
  });

  const set = <K extends keyof NewQna>(key: K, value: NewQna[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key as Field]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (mutation.isPending) return;
    const next = validate(values, agree);
    setErrors(next);
    const first = ORDER.find((k) => next[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#${fid(first)}`)?.focus();
      return;
    }
    mutation.mutate(values);
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

  const contentLen = values.content.length;

  return (
    <form ref={formRef} className={f.petitionForm} noValidate onSubmit={onSubmit}>
      <section className={f.formCard} aria-labelledby="qnaFormTitle">
        <Heading
          id="qnaFormTitle"
          title="질문 작성"
          aside={
            <p className={f.reqNote}>
              <span className={f.req} aria-hidden="true">
                *
              </span>{' '}
              표시는 필수 입력 항목입니다.
            </p>
          }
        />

        <div className={f.field}>
          <label className={f.fieldLabel} htmlFor={fid('writerName')}>
            이름 <span className={f.req} aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id={fid('writerName')}
            className={f.input}
            maxLength={RULES.writerName.max}
            autoComplete="name"
            required
            value={values.writerName}
            onChange={(e) => set('writerName', e.target.value)}
            readOnly={Boolean(user)}
            aria-describedby="qna-writerName-help"
            {...err('writerName')}
          />
          {user ? (
            <p className={f.fieldHelp}>로그인한 이름으로 등록되고, 내 질문에서 다시 볼 수 있어요.</p>
          ) : (
            <p className={f.fieldHelp}>
              <Link to="/login?next=%2Fsupport%2Fqna%2Fnew">로그인</Link>하고 등록하면 비공개 질문도 나중에 다시 볼 수 있어요.
            </p>
          )}
          <p className={f.fieldHelp} id="qna-writerName-help">
            목록에는 {values.writerName.trim().length >= 2 ? <strong>{maskName(values.writerName)}</strong> : '홍**'}처럼 첫 글자만 보여요.
          </p>
          {errText('writerName')}
        </div>

        <div className={f.field}>
          <label className={f.fieldLabel} htmlFor={fid('title')}>
            제목 <span className={f.req} aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id={fid('title')}
            className={f.input}
            maxLength={RULES.title.max}
            placeholder="질문 제목을 입력해 주세요 (2~100자)"
            required
            value={values.title}
            onChange={(e) => set('title', e.target.value)}
            {...err('title')}
          />
          {errText('title')}
        </div>

        <div className={f.field}>
          <label className={f.fieldLabel} htmlFor={fid('content')}>
            내용 <span className={f.req} aria-hidden="true">*</span>
          </label>
          <textarea
            id={fid('content')}
            className={f.textarea}
            maxLength={RULES.content.max}
            required
            aria-describedby="qna-content-count"
            value={values.content}
            onChange={(e) => set('content', e.target.value)}
            placeholder={'궁금한 내용을 구체적으로 작성해 주세요.\n주민등록번호 · 연락처 등 개인정보는 입력하지 마세요.'}
            {...err('content')}
          />
          <div className={f.fieldFoot}>
            {errText('content') ?? <span />}
            <p className={f.fieldCounter} id="qna-content-count">
              <span className="num">{contentLen.toLocaleString()}</span> / 4,000자
            </p>
          </div>
        </div>

        <fieldset className={f.field}>
          <legend className={f.fieldLabel}>공개 여부</legend>
          <label className={f.checkbox}>
            <input type="checkbox" id={fid('isPrivate')} checked={values.isPrivate} onChange={(e) => set('isPrivate', e.target.checked)} />
            <span className={f.checkboxMark} />
            비공개로 등록
          </label>
          <p className={f.fieldHelp}>비공개 글은 목록에 제목만 보이고 내용과 답변은 가려집니다.</p>
        </fieldset>
      </section>

      <section className={f.formCard} aria-labelledby="qnaPrivacyTitle">
        <Heading id="qnaPrivacyTitle" title="개인정보 수집·이용 동의" />
        <p className={f.fieldHelp}>수집 항목: 이름 · 이용 목적: 질문 접수 및 답변 · 보유 기간: 답변 완료 후 1년</p>
        <div className={f.agree}>
          <label className={f.checkbox}>
            <input type="checkbox" id={fid('agree')} required checked={agree} onChange={(e) => {
              setAgree(e.target.checked);
              if (errors.agree) setErrors((prev) => ({ ...prev, agree: undefined }));
            }} {...err('agree')} />
            <span className={f.checkboxMark} />
            위 내용을 확인했으며, 개인정보 수집·이용에 동의합니다. <span className="sr-only">(필수)</span>
          </label>
          {errText('agree')}
        </div>
      </section>

      {mutation.isError && (
        <p className={clsx(f.fieldHelp, f.fieldHelpError)} role="alert" style={{ textAlign: 'center' }}>
          등록하지 못했어요. {errorMessage(mutation.error)}
        </p>
      )}

      <div className={articleStyles.btnArea}>
        <Button href="/support/qna" variant="line" size="lg">
          취소
        </Button>
        <Button type="submit" variant="primary" size="lg" disabled={mutation.isPending} aria-busy={mutation.isPending || undefined}>
          {mutation.isPending ? '등록 중…' : '질문 등록'}
        </Button>
      </div>
    </form>
  );
}
