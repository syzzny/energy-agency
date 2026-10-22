import { Button } from '@/components/Button';
import { useSurvey } from '@/hooks';
import styles from './Survey.module.scss';

const OPTIONS = [
  { value: '5', label: '매우 만족' },
  { value: '4', label: '만족' },
  { value: '3', label: '보통' },
  { value: '2', label: '불만족' },
  { value: '1', label: '매우 불만족' },
];

export function Survey({ dept = '홍보소통실' }: { dept?: string }) {
  const onSubmit = useSurvey();

  return (
    <section className={styles.survey} aria-labelledby="surveyTitle">
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.head}>
          <h3 id="surveyTitle" className={styles.title}>
            이 페이지에서 제공하는 정보에 만족하셨나요?
          </h3>
          <p className={styles.manager}>
            담당 <span>{dept}</span> <span className="num">051-000-0000</span>
          </p>
        </div>
        <fieldset className={styles.options}>
          <legend className="sr-only">만족도 선택</legend>
          {OPTIONS.map((opt) => (
            <label key={opt.value} className={styles.option}>
              <input type="radio" name="satisfaction" value={opt.value} defaultChecked={opt.value === '5'} />
              <span>{opt.label}</span>
            </label>
          ))}
          <Button type="submit" size="sm" pill>
            평가하기
          </Button>
        </fieldset>
      </form>
    </section>
  );
}
