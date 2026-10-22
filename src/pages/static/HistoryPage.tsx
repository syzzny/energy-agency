import { useState } from 'react';
import clsx from 'clsx';
import { ChipGroup, Chip } from '@/components/Badge';
import { useToast } from '@/components/Toast';
import styles from './HistoryPage.module.scss';

interface HistoryItem {
  month: string;
  text: string;
  key?: boolean;
}
interface HistoryYear {
  year: string;
  sub?: string;
  category: string;
  items: HistoryItem[];
}

const PERIODS = [
  { key: 'all', label: '전체' },
  { key: 'p1', label: '2024 ~ 현재' },
  { key: 'p2', label: '2020 ~ 2023' },
  { key: 'p3', label: '2018 ~ 2019' },
];

const YEARS: HistoryYear[] = [
  {
    year: '2026',
    sub: '도약의 해',
    category: 'p1',
    items: [
      { month: '10', text: '지자체 148곳과 탄소중립 이행 협약 체결', key: true },
      { month: '07', text: '에너지바우처 하반기 지원 대상 확대 (12.6만 가구)' },
      { month: '03', text: '누리집 전면 개편 및 웹 접근성 품질인증 획득' },
    ],
  },
  {
    year: '2025',
    category: 'p1',
    items: [
      { month: '11', text: '국내 재생에너지 보급률 30% 돌파', key: true },
      { month: '06', text: '해상풍력 주민참여형 1호 단지 착공 (부산·울산권)' },
      { month: '02', text: '청정수소 충전소 구축 지원사업 신설' },
    ],
  },
  {
    year: '2024',
    category: 'p1',
    items: [
      { month: '09', text: '공공기관 에너지 효율 진단 컨설팅 사업 시작' },
      { month: '04', text: 'ESG 경영위원회 출범' },
    ],
  },
  {
    year: '2022',
    category: 'p2',
    items: [
      { month: '12', text: '본원 부산 해운대구 센텀 신사옥 이전', key: true },
      { month: '05', text: '건물 에너지효율 개선(그린리모델링) 사업 위탁기관 지정' },
    ],
  },
  {
    year: '2020',
    category: 'p2',
    items: [
      { month: '10', text: '주택 태양광 보급 누적 10만 가구 달성' },
      { month: '03', text: '지역에너지 지원센터 5개 권역 개소' },
    ],
  },
  {
    year: '2018',
    sub: '기관 설립',
    category: 'p3',
    items: [
      { month: '07', text: '에너지전환진흥원 설립 (초대 원장 취임)', key: true },
      { month: '01', text: '「에너지전환 촉진에 관한 법률」 제정에 따른 설립 근거 마련' },
    ],
  },
];

export default function HistoryPage() {
  const [active, setActive] = useState('all');
  const { show } = useToast();
  const filtered = active === 'all' ? YEARS : YEARS.filter((y) => y.category === active);

  return (
    <>
      <ChipGroup label="연대 선택">
        {PERIODS.map((p) => (
          <Chip
            key={p.key}
            active={p.key === active}
            onClick={() => {
              setActive(p.key);
              show(`${p.label} 연혁을 표시합니다.`);
            }}
          >
            {p.label}
          </Chip>
        ))}
      </ChipGroup>

      <div>
        {filtered.map((y) => (
          <section key={y.year} className={styles.year} aria-labelledby={`y${y.year}`}>
            <h3 className={styles.label} id={`y${y.year}`}>
              {y.year}
              {y.sub && <small>{y.sub}</small>}
            </h3>
            <ol className={styles.list}>
              {y.items.map((item) => (
                <li key={item.month + item.text} className={clsx(styles.item, item.key && styles.key)}>
                  <span className={styles.month}>{item.month}</span>
                  <p className={styles.text}>{item.text}</p>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </>
  );
}
