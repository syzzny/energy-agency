import { Icon } from '@/components/Icon';
import type { BusinessContact } from '@/data/types';
import styles from './ContactInfo.module.scss';

export function ContactInfo({ dept, tel, email }: BusinessContact) {
  return (
    <dl className={styles.contactInfo}>
      <div>
        <dt>담당부서</dt>
        <dd>{dept}</dd>
      </div>
      <div>
        <dt>
          <Icon name="phone" />
          전화
        </dt>
        <dd>
          <a href={`tel:${tel}`} className="num">
            {tel}
          </a>
        </dd>
      </div>
      <div>
        <dt>
          <Icon name="mail" />
          이메일
        </dt>
        <dd>
          <a href={`mailto:${email}`} className="num">
            {email}
          </a>
        </dd>
      </div>
    </dl>
  );
}
