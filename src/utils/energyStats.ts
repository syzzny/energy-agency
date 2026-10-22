import { SOURCES, REGIONS, type EnergySource, type EnergyStat } from '@/api/stats';

/** 집계 함수 모음 — 모두 순수 함수라 입력만 같으면 결과가 같다 (useMemo 로 감싸서 쓴다) */

export const ALL = '전국';

const inRegion = (region: string) => (s: EnergyStat) => region === ALL || s.region === region;
const sum = (list: EnergyStat[]) => list.reduce((acc, s) => acc + s.gwh, 0);

export function yearsOf(rows: EnergyStat[]): number[] {
  return [...new Set(rows.map((r) => r.year))].sort((a, b) => a - b);
}

export interface YearRow {
  year: number;
  values: Record<EnergySource, number>;
  total: number;
}

/** 연도별 · 에너지원별 발전량 (지역 필터 적용) */
export function byYear(rows: EnergyStat[], region: string): YearRow[] {
  const scoped = rows.filter(inRegion(region));
  return yearsOf(rows).map((year) => {
    const list = scoped.filter((r) => r.year === year);
    const values = Object.fromEntries(SOURCES.map((s) => [s, sum(list.filter((r) => r.source === s))])) as Record<EnergySource, number>;
    return { year, values, total: sum(list) };
  });
}

export interface RegionRow {
  region: string;
  total: number;
}

/** 시도별 총 발전량 (많은 순) */
export function byRegion(rows: EnergyStat[], year: number): RegionRow[] {
  const list = rows.filter((r) => r.year === year);
  return REGIONS.map((region) => ({ region, total: sum(list.filter((r) => r.region === region)) })).sort((a, b) => b.total - a.total);
}

export interface SourceRow {
  source: EnergySource;
  value: number;
  share: number;
}

/** 에너지원별 발전량과 비중 */
export function bySource(rows: EnergyStat[], year: number, region: string): SourceRow[] {
  const list = rows.filter((r) => r.year === year && inRegion(region)(r));
  const total = sum(list);
  return SOURCES.map((source) => {
    const value = sum(list.filter((r) => r.source === source));
    return { source, value, share: total ? value / total : 0 };
  });
}

/** 숫자 포맷 */
export const fmt = (n: number, digits = 0) => n.toLocaleString('ko-KR', { maximumFractionDigits: digits, minimumFractionDigits: digits });
/** 축 눈금용 짧은 표기 (12,000 → 1.2만) */
export const fmtCompact = (n: number) => new Intl.NumberFormat('ko-KR', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
export const fmtPct = (r: number, digits = 1) => `${(r * 100).toFixed(digits)}%`;
