import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { Icon } from '@/components/Icon';
import type { CardnewsItem, CardnewsSlide } from '@/data/types';
import { imageUrl, multiline } from '@/utils';
import styles from './CardnewsCard.module.scss';

/**
 * 에너지소비효율등급 라벨(1~5등급 색 막대)을 모티프로 한 카드뉴스 한 장.
 * - 오른쪽 세로 막대 = 페이지 표시. 장 수만큼 칸을 나누고 지금 장의 칸만 진하게 칠한다.
 * - 모든 치수는 카드 너비 기준(cqw)이라 목록 썸네일 · 메인 · 상세 뷰어 어디에 놓아도 같은 비율로 줄어든다.
 * - 글자는 이미지가 아닌 실제 텍스트라 스크린리더가 그대로 읽는다.
 */
export interface CardnewsCardProps {
  item: CardnewsItem;
  index: number;
  /** square: 1:1 (목록·뷰어) · wide: 메인 화면 가로형 */
  ratio?: 'square' | 'wide';
  className?: string;
}

// 에너지소비효율 1등급(초록) → 5등급(빨강) 색 막대
const GRADE = ['#00a651', '#8cc63f', '#f2c500', '#f7941d', '#e5352c'];

export function CardnewsCard({ item, index, ratio = 'square', className }: CardnewsCardProps) {
  const slide = item.slides[index];
  const total = item.slides.length;

  return (
    <div className={clsx(styles.card, styles[item.tone], ratio === 'wide' && styles.wide, className)}>
      {/* 바깥 div 는 크기 기준(container)만 맡고, 모서리·배경은 안쪽 면이 맡는다 (cqw 는 자기 자신이 아닌 바깥 기준으로 계산되므로) */}
      <div className={styles.face}>
        <div className={styles.inner}>
          <p className={styles.topic}>{item.topic}</p>
          <div className={clsx(styles.body, slide.type === 'cover' && styles.cover, slide.type === 'end' && styles.end)}>
            <SlideBody slide={slide} image={item.image} />
          </div>
          <p className={styles.foot}>
            <svg className={styles.logo} viewBox="0 0 36 36" aria-hidden="true">
              <rect width="36" height="36" rx="10" fill="currentColor" />
              <path d="M8 22c4-7 9-9 20-9-3 7-8 11-14 11-2 0-4-.6-6-2z" fill="var(--cn-bg)" />
            </svg>
            에너지전환진흥원
            <span className={clsx(styles.page, 'num')}>
              {String(index + 1).padStart(2, '0')}
              <span aria-hidden="true"> / </span>
              <span className="sr-only">장, 전체 </span>
              {String(total).padStart(2, '0')}
            </span>
          </p>
        </div>

        {/* 등급 라벨 막대 + 화살표 = 진행 표시 (화살표가 장을 넘길수록 아래로 내려간다) */}
        <div className={styles.grade} aria-hidden="true">
          {GRADE.map((color) => (
            <span key={color} style={{ background: color }} />
          ))}
          <i className={styles.pointer} style={{ '--at': `${((index + 0.5) / total) * 100}%` } as CSSProperties} />
        </div>
      </div>
    </div>
  );
}

function SlideBody({ slide, image }: { slide: CardnewsSlide; image: string }) {
  switch (slide.type) {
    case 'cover':
      return (
        <>
          <h4 className={styles.coverTitle}>{multiline(slide.title)}</h4>
          <p className={styles.coverSub}>{slide.sub}</p>
          <span className={styles.coverArt} aria-hidden="true">
            <img src={imageUrl(image)} alt="" width={480} height={480} loading="lazy" />
          </span>
        </>
      );
    case 'qa':
      return (
        <>
          <p className={styles.qaQ}>
            <span className={styles.qaMark} aria-hidden="true">
              Q
            </span>
            {slide.q}
          </p>
          <p className={styles.qaA}>{slide.a}</p>
        </>
      );
    case 'stat':
      return (
        <>
          <p className={styles.statLabel}>{slide.label}</p>
          <p className={styles.statValue}>
            <strong className="num">{slide.value}</strong>
            <span>{slide.unit}</span>
          </p>
          <p className={styles.statCaption}>{slide.caption}</p>
        </>
      );
    case 'list':
      return (
        <>
          <p className={styles.heading}>{slide.title}</p>
          <ul className={styles.checks}>
            {slide.items.map((t) => (
              <li key={t}>
                <Icon name="check" />
                {t}
              </li>
            ))}
          </ul>
        </>
      );
    case 'steps':
      return (
        <>
          <p className={styles.heading}>{slide.title}</p>
          <ol className={clsx(styles.steps, slide.steps.length > 3 && styles.stepsDense)}>
            {slide.steps.map((s, i) => (
              <li key={s.t}>
                <span className={clsx(styles.stepNum, 'num')} aria-hidden="true">
                  {i + 1}
                </span>
                <strong>{s.t}</strong>
                <span>{s.d}</span>
              </li>
            ))}
          </ol>
        </>
      );
    case 'end':
      return (
        <>
          <p className={styles.endTitle}>{multiline(slide.title)}</p>
          <p className={styles.endBody}>{slide.body}</p>
          <p className={styles.endCta}>{slide.cta}</p>
        </>
      );
  }
}

/** 카드 한 장의 내용을 한 줄 텍스트로 (텍스트 버전 · 대체 설명용) */
export function slideText(slide: CardnewsSlide): { head: string; body: string } {
  switch (slide.type) {
    case 'cover':
      return { head: slide.title.replace(/\n/g, ' '), body: slide.sub };
    case 'qa':
      return { head: slide.q, body: slide.a };
    case 'stat':
      return { head: `${slide.label}: ${slide.value}${slide.unit}`, body: slide.caption };
    case 'list':
      return { head: slide.title, body: slide.items.join(' / ') };
    case 'steps':
      return { head: slide.title, body: slide.steps.map((s, i) => `${i + 1}. ${s.t} — ${s.d}`).join(' / ') };
    case 'end':
      return { head: slide.title.replace(/\n/g, ' '), body: `${slide.body} (${slide.cta})` };
  }
}
