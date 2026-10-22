import { getSupabase } from '@/lib/supabase';

/**
 * 에너지 통계 API
 * - 연도 × 시도 × 에너지원 원자료(약 600행)를 한 번에 받아 화면에서 집계한다.
 *   필터를 바꿀 때마다 서버에 다시 묻지 않아도 되고, 캐시(React Query)로 페이지 재방문도 즉시 뜬다.
 */
export const SOURCES = ['태양광', '풍력', '수력', '바이오', '기타'] as const;
export type EnergySource = (typeof SOURCES)[number];

/** 시도 표시 순서 (행정구역 코드 순) */
export const REGIONS = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'] as const;

export interface EnergyStat {
  year: number;
  region: string;
  source: EnergySource;
  gwh: number;
}

interface Row {
  year: number;
  region: string;
  source: EnergySource;
  generation_gwh: number | string;
}

export async function fetchEnergyStats(signal?: AbortSignal): Promise<EnergyStat[]> {
  let query = getSupabase()
    .from('energy_stats')
    .select('year,region,source,generation_gwh')
    .order('year')
    .order('region')
    .order('source')
    .range(0, 1999);
  if (signal) query = query.abortSignal(signal);
  const { data, error } = await query;
  if (error) throw error;
  return (data as Row[]).map((r) => ({ year: r.year, region: r.region, source: r.source, gwh: Number(r.generation_gwh) }));
}
