import type { FormEvent } from 'react';
import { ChipFilter } from '@/components/ChipFilter';
import { AccordionItem } from '@/components/AccordionItem';
import accordionStyles from '@/components/AccordionItem/AccordionItem.module.scss';
import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { useChipFilter, useAccordion, useIsMobile } from '@/hooks';
import { faq, faqCategories } from '@/data/faq';
import styles from './FaqPage.module.scss';

export default function FaqPage() {
  const isMobile = useIsMobile();
  const { active, select, filtered } = useChipFilter(faq, (f) => f.category);
  const accordion = useAccordion(faq.filter((f) => f.open).map((f) => f.id));

  return (
    <>
      <form className={styles.faqSearch} role="search" onSubmit={(e: FormEvent) => e.preventDefault()}>
        <Icon name="search" />
        <label htmlFor="faqKeyword" className="sr-only">
          FAQ 검색어
        </label>
        <input type="search" id="faqKeyword" placeholder={isMobile ? '궁금한 내용 검색' : '궁금한 내용을 검색해 보세요 (예: 보조금 지급 시기)'} />
        <Button type="submit">검색</Button>
      </form>

      <ChipFilter label="질문 분류" items={faqCategories} active={active} onSelect={select} />

      <div className={accordionStyles.list}>
        {filtered.map((item) => (
          <AccordionItem key={item.id} item={item} isOpen={accordion.isOpen(item.id)} onToggle={() => accordion.toggle(item.id)} />
        ))}
      </div>

      <Pagination />

      <div className={styles.helpCta}>
        <div className={styles.helpCtaBody}>
          <span className={styles.helpCtaIcon} aria-hidden="true">
            <Icon name="message" />
          </span>
          <div>
            <strong>원하는 답변을 찾지 못하셨나요?</strong>
            <p>묻고 답하기에 남겨 주시면 담당 부서에서 3일 이내 답변드립니다.</p>
          </div>
        </div>
        <Button href="/support/qna" variant="light" pill icon="arrow">
          질문 남기기
        </Button>
      </div>
    </>
  );
}
