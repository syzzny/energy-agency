import { useState, type InputHTMLAttributes } from 'react';
import { Icon } from '@/components/Icon';
import { formStyles as f } from '@/components/Form';
import styles from './AuthPage.module.scss';

/** 비밀번호 입력 + 보기/숨기기 버튼 (버튼 상태는 aria-pressed 로 전달) */
export function PasswordField({ id, ...rest }: InputHTMLAttributes<HTMLInputElement> & { id: string }) {
  const [shown, setShown] = useState(false);
  return (
    <div className={styles.control}>
      <Icon name="lock" className={styles.controlIcon} />
      <input id={id} type={shown ? 'text' : 'password'} className={f.input} {...rest} />
      <button type="button" className={styles.reveal} aria-pressed={shown} aria-controls={id} onClick={() => setShown((v) => !v)}>
        <Icon name="eye" />
        <span className="sr-only">비밀번호 보기</span>
      </button>
    </div>
  );
}
