import { describe, expect, it } from 'vitest';
import type { EnergyStat } from '@/api/stats';
import { ALL, byRegion, bySource, byYear, fmtCompact, yearsOf } from './energyStats';

// 작은 가짜 데이터: 2년 × 2지역 × 2에너지원
const rows: EnergyStat[] = [
  { year: 2024, region: '강원', source: '태양광', gwh: 100 },
  { year: 2024, region: '강원', source: '수력', gwh: 300 },
  { year: 2024, region: '전남', source: '태양광', gwh: 500 },
  { year: 2024, region: '전남', source: '수력', gwh: 0 },
  { year: 2025, region: '강원', source: '태양광', gwh: 150 },
  { year: 2025, region: '강원', source: '수력', gwh: 250 },
  { year: 2025, region: '전남', source: '태양광', gwh: 700 },
  { year: 2025, region: '전남', source: '수력', gwh: 0 },
];

describe('energyStats 집계', () => {
  it('연도를 오름차순 · 중복 없이 뽑는다', () => {
    expect(yearsOf([...rows].reverse())).toEqual([2024, 2025]);
  });

  it('byYear: 전국은 모든 지역 합, 지역을 고르면 그 지역만', () => {
    const nation = byYear(rows, ALL);
    expect(nation.map((r) => r.total)).toEqual([900, 1100]);
    expect(nation[1].values.태양광).toBe(850);

    const gangwon = byYear(rows, '강원');
    expect(gangwon.map((r) => r.total)).toEqual([400, 400]);
    expect(gangwon[0].values.풍력).toBe(0); // 데이터가 없는 에너지원은 0
  });

  it('byRegion: 발전량이 많은 순으로 정렬한다', () => {
    const regions = byRegion(rows, 2025).filter((r) => r.total > 0);
    expect(regions.map((r) => r.region)).toEqual(['전남', '강원']);
  });

  it('bySource: 비중의 합은 1 이고, 발전량이 0 이면 비중도 0', () => {
    const list = bySource(rows, 2025, ALL);
    const sum = list.reduce((a, s) => a + s.share, 0);
    expect(sum).toBeCloseTo(1);
    expect(list.find((s) => s.source === '수력')?.share).toBeCloseTo(250 / 1100);
    expect(bySource([], 2025, ALL).every((s) => s.share === 0)).toBe(true);
  });

  it('fmtCompact: 축 눈금용 한국어 단위', () => {
    expect(fmtCompact(12000)).toBe('1.2만');
    expect(fmtCompact(500)).toBe('500');
  });
});
