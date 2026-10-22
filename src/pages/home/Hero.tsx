import clsx from 'clsx';
import { useEffect, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { useIsMobile, useSlider } from '@/hooks';
import { imageUrl } from '@/utils/asset';
import styles from './HomePage.module.scss';

const POPULAR = [
  { label: '태양광 보급지원', to: '/business/solar' },
  { label: '에너지바우처', to: '/support/faq' },
  { label: '녹색건축 인증', to: '/business/efficiency' },
  { label: '채용공고', to: '/news/recruit' },
];

const SLIDES = [
  {
    bg: 'photo-wind',
    chip: '2026 국민 에너지전환 비전',
    title: (
      <>
        깨끗한 에너지로 <br />
        모두의 내일을 잇습니다
      </>
    ),
    desc: (
      <>
        에너지전환진흥원은 재생에너지 보급과 에너지 효율 혁신으로 <br />
        국민 누구나 체감하는 탄소중립 사회를 앞당깁니다.
      </>
    ),
  },
  {
    bg: 'photo-solar',
    chip: '주택 태양광 보급지원',
    title: (
      <>
        우리 집 지붕에서 <br />
        시작하는 탄소중립
      </>
    ),
    desc: (
      <>
        설치비의 최대 50%를 지원합니다. <br />
        전기요금은 줄이고, 깨끗한 에너지는 늘리세요.
      </>
    ),
  },
  {
    bg: 'photo-home',
    chip: '에너지바우처',
    title: (
      <>
        따뜻한 겨울을 <br />
        함께 준비합니다
      </>
    ),
    desc: (
      <>
        취약계층 가구의 냉·난방비 부담을 덜어 드립니다. <br />
        하반기 신청 기간이 연장되었습니다.
      </>
    ),
  },
];

/** 첫 슬라이드가 뜨고 이 시간이 지난 뒤에야 나머지 슬라이드 사진을 받는다 (첫 로딩 용량 절약) */
const WARM_UP_MS = 2500;

export default function Hero() {
  const isMobile = useIsMobile();
  const slider = useSlider({ slideCount: SLIDES.length, intervalMs: 6000 });
  // 2·3번째 사진은 첫 화면에 보이지 않는데도 같은 위치에 겹쳐 있어 lazy 로는 미뤄지지 않는다.
  // 그래서 처음엔 주소(src)를 비워 두었다가, 잠시 뒤(또는 사용자가 넘기면 즉시) 채운다.
  const [warm, setWarm] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setWarm(true), WARM_UP_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className={styles.hero} aria-label="주요 안내">
      <div className={clsx('container', styles.heroInner)}>
        <div
          className={styles.heroVisual}
          data-slider
          aria-roledescription="carousel"
          aria-label="메인 비주얼"
          {...slider.containerProps}
        >
          <div className={styles.heroBgs} aria-hidden="true">
            {SLIDES.map((s, i) => (
              <img
                key={s.bg}
                className={clsx(styles.heroBg, i === slider.index && styles.active)}
                src={i === 0 || i === slider.index || warm ? imageUrl(s.bg) : undefined}
                alt=""
                width={1376}
                height={768}
                fetchPriority={i === 0 ? 'high' : undefined}
              />
            ))}
          </div>

          <div className={styles.liveCard}>
            <p className={styles.liveCardHead}>
              <span className={styles.liveCardDot} aria-hidden="true" />
              실시간 재생에너지 발전량
            </p>
            <p className={styles.liveCardValue}>
              <strong className="num">2,480</strong>
              <span>MW</span>
            </p>
            <svg className={styles.liveCardChart} viewBox="0 0 160 44" fill="none" role="img" aria-label="오늘 발전량 추이: 오전부터 꾸준히 증가">
              <defs>
                <linearGradient id="liveFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#5BF0BF" stopOpacity=".45" />
                  <stop offset="1" stopColor="#5BF0BF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 38 L18 34 L36 36 L54 28 L72 30 L90 20 L108 22 L126 12 L144 14 L160 6 V44 H0Z" fill="url(#liveFill)" />
              <path
                d="M0 38 L18 34 L36 36 L54 28 L72 30 L90 20 L108 22 L126 12 L144 14 L160 6"
                stroke="#5BF0BF"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
            <p className={styles.liveCardMeta}>
              전일 대비 <em>▲ 3.8%</em>
            </p>
          </div>

          <div className={styles.heroControl}>
            <span>
              <span className="num">{String(slider.index + 1).padStart(2, '0')}</span>
              <span className="sr-only">번째 슬라이드</span>
            </span>
            <span className={styles.heroProgress} aria-hidden="true">
              <span key={slider.resetKey} className={clsx(!slider.paused && !slider.held && styles.running)} style={{ '--interval': `${slider.intervalMs}ms` } as CSSProperties} />
            </span>
            <span className="total">
              03<span className="sr-only">개 중</span>
            </span>
            <button type="button" className={styles.heroToggle} aria-pressed={slider.paused} onClick={slider.togglePause}>
              <Icon name={slider.paused ? 'play' : 'pause'} />
              <span className="sr-only">자동 넘김 {slider.paused ? '재생' : '정지'}</span>
            </button>
          </div>

          <div className={styles.heroSlides}>
            {SLIDES.map((s, i) => (
              <div
                key={s.chip}
                className={clsx(styles.heroSlide, i === slider.index && styles.active)}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${SLIDES.length}`}
              >
                <span className={styles.heroChip}>{s.chip}</span>
                <p className={styles.heroTitle}>{s.title}</p>
                <p className={styles.heroDesc}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div className={styles.heroSearch}>
            <form className={styles.heroForm} action="#" role="search">
              <label htmlFor="mainSearch" className="sr-only">
                통합검색
              </label>
              <input type="search" id="mainSearch" placeholder={isMobile ? '사업·서비스 검색' : '궁금한 사업이나 서비스를 검색해 보세요'} />
              <button type="submit">
                <Icon name="search" />
                <span className="sr-only">검색</span>
              </button>
            </form>
            <dl className={styles.heroKeywords}>
              <dt>인기검색어</dt>
              {POPULAR.map((k) => (
                <dd key={k.to}>
                  <Link to={k.to}># {k.label}</Link>
                </dd>
              ))}
            </dl>
          </div>
        </div>

        <HeroSide />
      </div>
    </section>
  );
}

function HeroSide() {
  const notices = [
    { badge: '접수중', variant: 'green' as const, dday: 'D-24', title: '2026년 주택 태양광 보급지원사업 참여기업 모집 공고', href: '/news/notice/n1', period: '2026.10.20 ~ 2026.11.14' },
    { badge: '접수중', variant: 'green' as const, dday: 'D-40', title: '에너지바우처 하반기 신청 기간 연장 안내', href: '/news/notice/n2', period: '2026.07.01 ~ 2026.11.30' },
    { badge: '마감임박', variant: 'glass' as const, dday: 'D-3', title: '2026년 녹색건축 인증 심사위원 공개 모집', href: '/news/notice/n3', period: '2026.10.14 ~ 2026.10.24' },
  ];
  const slider = useSlider({ slideCount: notices.length, intervalMs: 5000 });

  return (
    <div className={styles.heroSide}>
      <section className={styles.boardCard} aria-labelledby="boardCardTitle">
        <div className={styles.boardCardHead}>
          <h3 className={styles.boardCardLabel} id="boardCardTitle">
            알림판
          </h3>
          <div className={styles.boardCardPager}>
            <IconButton icon="left" label="이전 알림" size="sm" onDark onClick={slider.prev} />
            <span>
              <span>{slider.index + 1}</span> / {notices.length}
            </span>
            <IconButton icon="right" label="다음 알림" size="sm" onDark onClick={slider.next} />
          </div>
        </div>
        <div className={styles.heroSlides}>
          {notices.map((n, i) => (
            <div key={n.title} className={clsx(styles.heroSlide, i === slider.index && styles.active)}>
              <div className={styles.boardCardBadges}>
                <Badge label={n.badge} variant={n.variant} />
                <Badge label={n.dday} variant="glass" className="num" />
              </div>
              <p className={styles.boardCardTitle}>
                <Link to={n.href}>{n.title}</Link>
              </p>
              <p className={styles.boardCardPeriod}>
                접수기간 <span className="num">{n.period}</span>
              </p>
            </div>
          ))}
        </div>
        <Link to="/news/notice" className={styles.boardCardCta}>
          공고 전체 보기
          <Icon name="arrow" />
        </Link>
      </section>

      <div className={styles.contactCard}>
        <span className={styles.contactCardIcon} aria-hidden="true">
          <Icon name="phone" />
        </span>
        <div>
          <p className={styles.contactCardLabel}>고객센터</p>
          <a href="tel:1600-0000" className={styles.contactCardTel}>
            1600-0000
          </a>
          <p className={styles.contactCardTime}>평일 09:00 ~ 18:00 (점심 12:00 ~ 13:00)</p>
        </div>
      </div>
    </div>
  );
}
