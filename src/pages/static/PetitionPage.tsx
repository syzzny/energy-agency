import { useRef } from 'react';
import clsx from 'clsx';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Stepper } from '@/components/Stepper';
import { formStyles as f } from '@/components/Form';
import btnStyles from '@/components/Button/Button.module.scss';
import articleStyles from '@/components/Article/Article.module.scss';
import { useCharCounter, useFileValidation, useEmailDomainSelect, useFormValidation } from '@/hooks';
import { Heading } from '@/components/Heading';
import { DataTable } from '@/components/DataTable';

const STEPS = [
  { label: '약관 동의', en: 'STEP 01' },
  { label: '민원 작성', en: 'STEP 02' },
  { label: '신청 완료', en: 'STEP 03' },
];

export default function PetitionPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const counter = useCharCounter(4000);
  const file = useFileValidation(3);
  const email = useEmailDomainSelect();
  const { validate, clearError, isInvalid } = useFormValidation();

  const errorProps = (name: string) => ({
    'aria-invalid': isInvalid(name) ? ('true' as const) : undefined,
    'aria-errormessage': `${name}Err`,
  });

  return (
    <>
      <Stepper steps={STEPS} currentIndex={1} />

      <form
        ref={formRef}
        className={f.petitionForm}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          validate(e.currentTarget);
        }}
        onInput={(e) => clearError((e.target as HTMLElement).id)}
      >
        {/* 신청인 정보 */}
        <section className={f.formCard} aria-labelledby="applicantTitle">
          <Heading
            id="applicantTitle"
            title="신청인 정보"
            aside={
              <p className={f.reqNote}>
                <span className={f.req} aria-hidden="true">
                  *
                </span>{' '}
                표시는 필수 입력 항목입니다.
              </p>
            }
          />

          <div className={f.fieldRow}>
            <div className={f.field}>
              <label className={f.fieldLabel} htmlFor="name">
                이름 <span className={f.req} aria-hidden="true">*</span>
              </label>
              <input type="text" id="name" className={f.input} defaultValue="홍길동" readOnly aria-describedby="nameHelp" />
              <p className={f.fieldHelp} id="nameHelp">
                본인인증 정보로 자동 입력됩니다.
              </p>
            </div>

            <fieldset className={f.field}>
              <legend className={f.fieldLabel}>
                휴대전화 <span className={f.req} aria-hidden="true">*</span>
              </legend>
              <div className={f.fieldControls}>
                <label className={clsx(f.select, f.selectTel)}>
                  <span className="sr-only">휴대전화 앞자리</span>
                  <select name="tel1">
                    <option>010</option>
                    <option>011</option>
                    <option>016</option>
                  </select>
                </label>
                <span className={f.sep} aria-hidden="true">-</span>
                <label className="sr-only" htmlFor="tel2">
                  휴대전화 가운데자리
                </label>
                <input type="tel" id="tel2" className={f.input} inputMode="numeric" maxLength={4} required {...errorProps('tel2')} />
                <span className={f.sep} aria-hidden="true">-</span>
                <label className="sr-only" htmlFor="tel3">
                  휴대전화 끝자리
                </label>
                <input type="tel" id="tel3" className={f.input} inputMode="numeric" maxLength={4} required {...errorProps('tel3')} />
              </div>
              <p className={clsx(f.fieldHelp, f.fieldHelpError)} id="tel2Err" hidden={!isInvalid('tel2')}>
                휴대전화 번호를 입력해 주세요.
              </p>
            </fieldset>
          </div>

          <fieldset className={f.field}>
            <legend className={f.fieldLabel}>이메일</legend>
            <div className={clsx(f.fieldControls, f.fieldControlsEmail)}>
              <label className="sr-only" htmlFor="emailId">
                이메일 아이디
              </label>
              <input type="text" id="emailId" className={f.input} placeholder="이메일 아이디" autoComplete="off" />
              <span className={f.sep}>@</span>
              <label className="sr-only" htmlFor="emailDomain">
                이메일 도메인
              </label>
              <input type="text" id="emailDomain" className={f.input} placeholder="직접 입력" value={email.domain} onChange={email.onDomainChange} readOnly={!email.isCustom} />
              <label className={f.select}>
                <span className="sr-only">이메일 도메인 선택</span>
                <select onChange={email.onSelectChange}>
                  <option value="">직접 입력</option>
                  <option>naver.com</option>
                  <option>gmail.com</option>
                  <option>daum.net</option>
                  <option>kakao.com</option>
                </select>
              </label>
            </div>
            <p className={f.fieldHelp}>처리 결과를 이메일로 받으려면 입력해 주세요.</p>
          </fieldset>

          <fieldset className={f.field}>
            <legend className={f.fieldLabel}>주소</legend>
            <div className={f.fieldControls}>
              <label className="sr-only" htmlFor="zip">
                우편번호
              </label>
              <input type="text" id="zip" className={clsx(f.input, f.inputZip)} placeholder="우편번호" readOnly />
              <Button type="button" variant="dark">
                주소 검색
              </Button>
            </div>
            <label className="sr-only" htmlFor="addr1">
              기본주소
            </label>
            <input type="text" id="addr1" className={f.input} placeholder="기본주소" readOnly />
            <label className="sr-only" htmlFor="addr2">
              상세주소
            </label>
            <input type="text" id="addr2" className={f.input} placeholder="상세주소를 입력해 주세요" />
          </fieldset>
        </section>

        {/* 민원 내용 */}
        <section className={f.formCard} aria-labelledby="petitionTitle">
          <Heading id="petitionTitle" title="민원 내용" />

          <div className={f.fieldRow}>
            <div className={f.field}>
              <label className={f.fieldLabel} htmlFor="category">
                민원 분야 <span className={f.req} aria-hidden="true">*</span>
              </label>
              <span className={f.select}>
                <select id="category" required {...errorProps('category')}>
                  <option value="">분야를 선택하세요</option>
                  <option>재생에너지 보급지원</option>
                  <option>에너지 효율 개선</option>
                  <option>에너지바우처</option>
                  <option>누리집 이용</option>
                  <option>기타</option>
                </select>
              </span>
              <p className={clsx(f.fieldHelp, f.fieldHelpError)} id="categoryErr" hidden={!isInvalid('category')}>
                민원 분야를 선택해 주세요.
              </p>
            </div>

            <fieldset className={f.field}>
              <legend className={f.fieldLabel}>
                결과 수신 방법 <span className={f.req} aria-hidden="true">*</span>
              </legend>
              <div className={f.radioGroup}>
                <label className={f.radio}>
                  <input type="radio" name="receive" value="sms" defaultChecked />
                  <span className={f.mark} />
                  문자(SMS)
                </label>
                <label className={f.radio}>
                  <input type="radio" name="receive" value="email" />
                  <span className={f.mark} />
                  이메일
                </label>
                <label className={f.radio}>
                  <input type="radio" name="receive" value="post" />
                  <span className={f.mark} />
                  우편
                </label>
              </div>
            </fieldset>
          </div>

          <div className={f.field}>
            <label className={f.fieldLabel} htmlFor="subject">
              제목 <span className={f.req} aria-hidden="true">*</span>
            </label>
            <input type="text" id="subject" className={f.input} maxLength={100} placeholder="민원 제목을 입력해 주세요 (최대 100자)" required {...errorProps('subject')} />
            <p className={clsx(f.fieldHelp, f.fieldHelpError)} id="subjectErr" hidden={!isInvalid('subject')}>
              제목을 입력해 주세요.
            </p>
          </div>

          <div className={f.field}>
            <label className={f.fieldLabel} htmlFor="body">
              내용 <span className={f.req} aria-hidden="true">*</span>
            </label>
            <textarea
              id="body"
              className={f.textarea}
              maxLength={4000}
              required
              aria-describedby="bodyCount"
              value={counter.value}
              onChange={counter.onChange}
              placeholder={'민원 내용을 구체적으로 작성해 주세요.\n개인정보(주민등록번호 등)는 입력하지 마세요.'}
              {...errorProps('body')}
            />
            <div className={f.fieldFoot}>
              <p className={clsx(f.fieldHelp, f.fieldHelpError)} id="bodyErr" hidden={!isInvalid('body')}>
                내용을 입력해 주세요.
              </p>
              <p className={f.fieldCounter} id="bodyCount" aria-live="polite">
                {counter.text}
              </p>
            </div>
          </div>

          <div className={f.field}>
            <span className={f.fieldLabel} id="fileLabel">
              첨부파일
            </span>
            <div className={f.fileInput}>
              <p className={clsx(f.fileInputName, file.hasFile && f.hasFile)}>
                <span>{file.label}</span>
                <Icon name="clip" />
              </p>
              <input type="file" id="file" className={f.fileInputHidden} multiple accept=".hwp,.pdf,.jpg,.jpeg,.png" onChange={file.onChange} aria-labelledby="fileLabel" aria-describedby="fileHelp" />
              <label htmlFor="file" className={clsx(btnStyles.btn, btnStyles.line)}>
                파일 선택
              </label>
            </div>
            <p className={f.fieldHelp} id="fileHelp">
              최대 3개, 파일당 10MB 이하 (hwp, pdf, jpg, png)
            </p>
          </div>

          <fieldset className={f.field}>
            <legend className={f.fieldLabel}>
              공개 여부 <span className={f.req} aria-hidden="true">*</span>
            </legend>
            <div className={f.radioGroup}>
              <label className={f.radio}>
                <input type="radio" name="open" value="y" />
                <span className={f.mark} />
                공개
              </label>
              <label className={f.radio}>
                <input type="radio" name="open" value="n" defaultChecked />
                <span className={f.mark} />
                비공개
              </label>
            </div>
            <p className={f.fieldHelp}>비공개로 신청하면 처리 결과가 신청인에게만 공개됩니다.</p>
          </fieldset>
        </section>

        {/* 개인정보 동의 */}
        <section className={f.formCard} aria-labelledby="privacyTitle">
          <Heading id="privacyTitle" title="개인정보 수집·이용 동의" />
          <DataTable
            caption="개인정보 수집·이용 내역 — 수집 항목, 이용 목적, 보유 기간"
            cols={[
              { label: '수집 항목', width: null, style: null },
              { label: '이용 목적', width: null, style: null },
              { label: '보유 기간', width: null, style: null },
            ]}
            rows={[['이름, 휴대전화, 이메일, 주소', '민원 접수 및 처리 결과 통보', '처리 완료 후 3년']]}
            rowHeader={false}
          />
          <p className={f.fieldHelp}>개인정보 수집·이용에 동의하지 않을 권리가 있으며, 동의하지 않으면 민원 신청이 제한됩니다.</p>
          <div className={f.agree}>
            <label className={f.checkbox}>
              <input type="checkbox" id="agree" required {...errorProps('agree')} />
              <span className={f.checkboxMark} />
              위 내용을 확인했으며, 개인정보 수집·이용에 동의합니다. <span className="sr-only">(필수)</span>
            </label>
            <p className={clsx(f.fieldHelp, f.fieldHelpError)} id="agreeErr" hidden={!isInvalid('agree')}>
              개인정보 수집·이용에 동의해 주세요.
            </p>
          </div>
        </section>

        <div className={articleStyles.btnArea}>
          <Button href="/support/faq" variant="line" size="lg">
            이전 단계
          </Button>
          <Button type="submit" variant="primary" size="lg">
            민원 신청하기
          </Button>
        </div>
      </form>
    </>
  );
}
