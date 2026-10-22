import { useMemo, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { EChart, type EChartOption } from '@/components/EChart';
import type { TooltipComponentOption } from 'echarts/components';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { TextNote } from '@/components/TextNote';
import { StateMessage } from '@/components/AsyncState';
import { formStyles as f } from '@/components/Form';
import { errorMessage } from '@/api/qna';
import { fetchEnergyStats, REGIONS, SOURCES, type EnergySource, type EnergyStat } from '@/api/stats';
import { ALL, byRegion, bySource, byYear, fmt, fmtCompact, fmtPct, yearsOf } from '@/utils/energyStats';
import styles from './StatsPage.module.scss';

// ---------- 차트 공통 값 ----------
/** 에너지원 → 색. 순서와 짝이 고정돼 있어 필터를 바꿔도 색이 바뀌지 않는다 (색약 시뮬레이션 검증 완료) */
const SOURCE_COLOR: Record<EnergySource, string> = {
  태양광: '#eda100',
  풍력: '#1baf7a',
  수력: '#1d5bd8',
  바이오: '#008300',
  기타: '#e87ba4',
};
const INK = '#151a26';
const MUTED = '#5c6375';
const GRID = '#e3e7ee';
const FONT = "'Pretendard Variable', Pretendard, -apple-system, system-ui, sans-serif";

const tooltipBase: TooltipComponentOption = {
  backgroundColor: '#fff',
  borderColor: GRID,
  borderWidth: 1,
  padding: [10, 12],
  textStyle: { color: INK, fontFamily: FONT, fontSize: 13 },
  extraCssText: 'box-shadow:0 8px 24px rgba(11,31,68,.12);border-radius:10px;',
};

const swatch = (color: string) => `<span style="display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:6px;background:${color}"></span>`;
const row = (left: string, right: string, strong = false) =>
  `<div style="display:flex;justify-content:space-between;gap:16px;${strong ? 'font-weight:700;margin-top:4px;padding-top:4px;border-top:1px solid ' + GRID : ''}"><span>${left}</span><span>${right}</span></div>`;

/** 차트 카드 — 제목 · 설명 · 차트 · 표로 보기 */
function ChartCard({ id, title, desc, children, table, className }: { id: string; title: string; desc: string; children: ReactNode; table: ReactNode; className?: string }) {
  return (
    <section className={clsx(styles.card, className)} aria-labelledby={id}>
      <header className={styles.cardHead}>
        <h3 id={id}>{title}</h3>
        <p>{desc}</p>
      </header>
      {children}
      <details className={styles.tableToggle}>
        <summary>
          표로 보기 <Icon name="down" />
        </summary>
        <div className={styles.tableWrap}>{table}</div>
      </details>
    </section>
  );
}

function Delta({ ratio, label }: { ratio: number; label: string }) {
  const up = ratio >= 0;
  return (
    <p className={clsx(styles.delta, up ? styles.up : styles.down)}>
      <Icon name={up ? 'up' : 'down'} />
      <span className="sr-only">{up ? '증가' : '감소'}</span>
      {label} {fmtPct(Math.abs(ratio))}
    </p>
  );
}

/**
 * 에너지 통계 대시보드
 * - Supabase 에서 원자료를 받아(React Query 캐시) 화면에서 연도 · 지역 기준으로 집계
 * - 필터는 주소(?year=&region=)에 남아 공유 · 새로고침해도 같은 화면
 * - 모든 차트에 같은 내용의 표(표로 보기)와 한 문장 요약(스크린리더)을 함께 제공
 */
export default function StatsPage() {
  const { data: rows, error, isPending, isError, refetch } = useQuery({
    queryKey: ['energy-stats'],
    queryFn: ({ signal }) => fetchEnergyStats(signal),
    staleTime: 10 * 60_000,
  });

  if (isPending) {
    return (
      <div className={styles.dashboard} aria-busy="true">
        <p className="sr-only" role="status">
          통계를 불러오는 중입니다.
        </p>
        <div className={styles.kpis} aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={clsx(styles.kpi, styles.skeleton)} />
          ))}
        </div>
        <div className={clsx(styles.card, styles.skeleton, styles.skeletonChart)} aria-hidden="true" />
      </div>
    );
  }

  if (isError || !rows.length) {
    return (
      <StateMessage
        variant={isError ? 'error' : 'empty'}
        title={isError ? '통계를 불러오지 못했어요' : '아직 등록된 통계가 없어요'}
        desc={isError ? errorMessage(error) : '데이터가 준비되면 이곳에 표시됩니다.'}
        action={
          isError && (
            <Button variant="line" icon="right" onClick={() => refetch()}>
              다시 시도
            </Button>
          )
        }
      />
    );
  }

  return <Dashboard rows={rows} />;
}

function Dashboard({ rows }: { rows: EnergyStat[] }) {
  const [params, setParams] = useSearchParams();
  const years = useMemo(() => yearsOf(rows), [rows]);
  const lastYear = years[years.length - 1];
  const firstYear = years[0];

  const yearParam = Number(params.get('year'));
  const year = years.includes(yearParam) ? yearParam : lastYear;
  const regionParam = params.get('region') ?? ALL;
  const region = (REGIONS as readonly string[]).includes(regionParam) ? regionParam : ALL;
  const scope = region === ALL ? '전국' : region;

  const setFilter = (key: 'year' | 'region', value: string) => {
    const next = new URLSearchParams(params);
    const isDefault = (key === 'year' && Number(value) === lastYear) || (key === 'region' && value === ALL);
    if (isDefault) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const trend = useMemo(() => byYear(rows, region), [rows, region]);
  const regions = useMemo(() => byRegion(rows, year), [rows, year]);
  const sources = useMemo(() => bySource(rows, year, region), [rows, year, region]);

  // ---------- 핵심 지표 ----------
  const cur = trend.find((t) => t.year === year)!;
  const prev = trend.find((t) => t.year === year - 1);
  const first = trend[0];
  const topSource = [...sources].sort((a, b) => b.value - a.value)[0];
  const nationTotal = regions.reduce((a, r) => a + r.total, 0);
  const regionRank = regions.findIndex((r) => r.region === region) + 1;

  // ---------- 차트 옵션 ----------
  const trendOption = useMemo<EChartOption>(
    () => ({
      textStyle: { fontFamily: FONT },
      grid: { top: 28, right: 8, bottom: 28, left: 8, containLabel: true },
      tooltip: {
        ...tooltipBase,
        trigger: 'axis',
        axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(29,91,216,.06)' } },
        formatter: (ps: unknown) => {
          const list = ps as { dataIndex: number }[];
          const t = trend[list[0].dataIndex];
          return (
            `<strong style="display:block;margin-bottom:6px">${t.year}년 · ${scope}</strong>` +
            [...SOURCES].reverse().map((s) => row(swatch(SOURCE_COLOR[s]) + s, `${fmt(t.values[s])} GWh`)).join('') +
            row('합계', `${fmt(t.total)} GWh`, true)
          );
        },
      },
      xAxis: {
        type: 'category',
        data: trend.map((t) => `${t.year}`),
        axisLine: { lineStyle: { color: GRID } },
        axisTick: { show: false },
        axisLabel: { color: MUTED, fontSize: 12, interval: 0 },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: GRID } },
        axisLabel: { color: MUTED, fontSize: 12, formatter: (v: number) => fmtCompact(v) },
      },
      series: SOURCES.map((s, i) => ({
        name: s,
        type: 'bar' as const,
        stack: 'total',
        barMaxWidth: 24,
        data: trend.map((t) => ({
          value: Math.round(t.values[s]),
          // 선택한 연도가 아닌 막대는 살짝 흐리게
          itemStyle: { opacity: t.year === year ? 1 : 0.45 },
        })),
        itemStyle: {
          color: SOURCE_COLOR[s],
          borderColor: '#fff',
          borderWidth: 1, // 조각 사이 2px 흰 틈
          borderRadius: i === SOURCES.length - 1 ? [4, 4, 0, 0] : 0,
        },
        emphasis: { disabled: true },
        // 맨 위 조각에만 합계를 붙인다
        label:
          i === SOURCES.length - 1
            ? {
                show: true,
                position: 'top' as const,
                color: INK,
                fontSize: 12,
                fontWeight: 600,
                formatter: (p: { dataIndex: number }) => fmtCompact(trend[p.dataIndex].total),
              }
            : undefined,
      })),
    }),
    [trend, year, scope],
  );

  const sourceOption = useMemo<EChartOption>(
    () => ({
      textStyle: { fontFamily: FONT },
      tooltip: {
        ...tooltipBase,
        trigger: 'item',
        formatter: (p: unknown) => {
          const { dataIndex } = p as { dataIndex: number };
          const s = sources[dataIndex];
          return `<strong style="display:block;margin-bottom:6px">${swatch(SOURCE_COLOR[s.source])}${s.source}</strong>` + row('발전량', `${fmt(s.value)} GWh`) + row('비중', fmtPct(s.share));
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['58%', '86%'],
          center: ['50%', '50%'],
          startAngle: 90,
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'center',
            formatter: () => `{a|${year}년 ${scope}}\n{b|${fmt(cur.total)}}\n{a|GWh}`,
            rich: {
              a: { color: MUTED, fontSize: 12, lineHeight: 18, fontFamily: FONT },
              b: { color: INK, fontSize: 22, fontWeight: 700, lineHeight: 30, fontFamily: FONT },
            },
          },
          labelLine: { show: false },
          itemStyle: { borderColor: '#fff', borderWidth: 2 },
          emphasis: { scale: true, scaleSize: 4, label: { show: true } },
          data: sources.map((s) => ({ name: s.source, value: Math.round(s.value), itemStyle: { color: SOURCE_COLOR[s.source] } })),
        },
      ],
    }),
    [sources, year, scope, cur.total],
  );

  const regionOption = useMemo<EChartOption>(
    () => ({
      textStyle: { fontFamily: FONT },
      grid: { top: 4, right: 52, bottom: 4, left: 4, containLabel: true },
      tooltip: {
        ...tooltipBase,
        trigger: 'item',
        formatter: (p: unknown) => {
          const { dataIndex } = p as { dataIndex: number };
          const r = regions[dataIndex];
          return `<strong style="display:block;margin-bottom:6px">${r.region} · ${dataIndex + 1}위</strong>` + row('발전량', `${fmt(r.total)} GWh`) + row('전국 대비', fmtPct(r.total / nationTotal));
        },
      },
      xAxis: { type: 'value', show: false },
      yAxis: {
        type: 'category',
        inverse: true,
        data: regions.map((r) => r.region),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: INK, fontSize: 13 },
      },
      series: [
        {
          type: 'bar',
          barMaxWidth: 14,
          cursor: 'pointer',
          data: regions.map((r) => ({
            value: Math.round(r.total),
            itemStyle: { color: region === ALL || r.region === region ? '#1d5bd8' : '#c4deff' },
          })),
          itemStyle: { borderRadius: [0, 4, 4, 0] },
          label: { show: true, position: 'right', color: MUTED, fontSize: 12, formatter: (p) => fmt(Number(p.value)) },
          emphasis: { itemStyle: { color: '#1449b3' } },
        },
      ],
    }),
    [regions, region, nationTotal],
  );

  // ---------- 스크린리더 요약 ----------
  const trendLabel = `${scope} 연도별 재생에너지 발전량 누적 막대 차트. ${firstYear}년 ${fmt(first.total)}GWh에서 ${lastYear}년 ${fmt(trend[trend.length - 1].total)}GWh로 변했습니다. 가장 큰 비중은 ${topSource.source}입니다.`;
  const sourceLabel = `${year}년 ${scope} 에너지원별 비중 도넛 차트. ${sources.map((s) => `${s.source} ${fmtPct(s.share)}`).join(', ')}.`;
  const regionLabel = `${year}년 시도별 발전량 막대 차트. 1위 ${regions[0].region} ${fmt(regions[0].total)}GWh, 2위 ${regions[1].region}, 3위 ${regions[2].region}.`;

  return (
    <div className={styles.dashboard}>
      {/* 필터 — 차트 위 한 줄 */}
      <form className={styles.filters} onSubmit={(e) => e.preventDefault()} aria-label="통계 조건">
        <label className={styles.filter}>
          <span>기준 연도</span>
          <span className={f.select}>
            <select value={year} onChange={(e) => setFilter('year', e.target.value)}>
              {[...years].reverse().map((y) => (
                <option key={y} value={y}>
                  {y}년
                </option>
              ))}
            </select>
          </span>
        </label>
        <label className={styles.filter}>
          <span>지역</span>
          <span className={f.select}>
            <select value={region} onChange={(e) => setFilter('region', e.target.value)}>
              <option value={ALL}>전국</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </span>
        </label>
        {(region !== ALL || year !== lastYear) && (
          <button type="button" className={styles.reset} onClick={() => setParams(new URLSearchParams(), { replace: true })}>
            <Icon name="close" /> 조건 초기화
          </button>
        )}
        <p className="sr-only" aria-live="polite">
          {year}년 {scope} 기준 통계입니다. 총 발전량 {fmt(cur.total)}기가와트시.
        </p>
      </form>

      {/* 핵심 지표 */}
      <ul className={styles.kpis}>
        <li className={clsx(styles.kpi, styles.kpiHero)}>
          <p className={styles.kpiLabel}>
            {year}년 {scope} 재생에너지 발전량
          </p>
          <p className={styles.kpiValue}>
            {fmt(cur.total)}
            <small>GWh</small>
          </p>
          {prev ? <Delta ratio={(cur.total - prev.total) / prev.total} label="전년 대비" /> : <p className={styles.kpiSub}>비교할 전년 자료 없음</p>}
        </li>
        <li className={styles.kpi}>
          <p className={styles.kpiLabel}>가장 많이 생산한 에너지원</p>
          <p className={styles.kpiValue}>
            <span className={styles.kpiDot} style={{ background: SOURCE_COLOR[topSource.source] }} aria-hidden="true" />
            {topSource.source}
          </p>
          <p className={styles.kpiSub}>전체의 {fmtPct(topSource.share)}</p>
        </li>
        <li className={styles.kpi}>
          <p className={styles.kpiLabel}>{firstYear}년 대비 성장</p>
          {year === firstYear ? (
            <>
              <p className={styles.kpiValue}>기준 연도</p>
              <p className={styles.kpiSub}>{firstYear}년이 비교 기준입니다</p>
            </>
          ) : (
            <>
              <p className={styles.kpiValue}>
                {(cur.total / first.total).toFixed(2)}
                <small>배</small>
              </p>
              <p className={styles.kpiSub}>
                {fmt(first.total)} → {fmt(cur.total)} GWh
              </p>
            </>
          )}
        </li>
        <li className={styles.kpi}>
          {region === ALL ? (
            <>
              <p className={styles.kpiLabel}>발전량 1위 지역</p>
              <p className={styles.kpiValue}>{regions[0].region}</p>
              <p className={styles.kpiSub}>전국의 {fmtPct(regions[0].total / nationTotal)}</p>
            </>
          ) : (
            <>
              <p className={styles.kpiLabel}>전국 대비 비중</p>
              <p className={styles.kpiValue}>{fmtPct(cur.total / nationTotal)}</p>
              <p className={styles.kpiSub}>17개 시도 중 {regionRank}위</p>
            </>
          )}
        </li>
      </ul>

      <ChartCard
        id="chartTrend"
        title="연도별 발전량"
        desc={`${scope} · ${firstYear}~${lastYear}년 · 단위 GWh`}
        table={
          <table className={styles.table}>
            <caption className="sr-only">{scope} 연도별 에너지원별 발전량 (단위 GWh)</caption>
            <thead>
              <tr>
                <th scope="col">연도</th>
                {SOURCES.map((s) => (
                  <th key={s} scope="col">
                    {s}
                  </th>
                ))}
                <th scope="col">합계</th>
              </tr>
            </thead>
            <tbody>
              {trend.map((t) => (
                <tr key={t.year} className={clsx(t.year === year && styles.current)}>
                  <th scope="row">{t.year}</th>
                  {SOURCES.map((s) => (
                    <td key={s}>{fmt(t.values[s])}</td>
                  ))}
                  <td>
                    <strong>{fmt(t.total)}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      >
        <ul className={styles.legend} aria-hidden="true">
          {SOURCES.map((s) => (
            <li key={s}>
              <span style={{ background: SOURCE_COLOR[s] }} />
              {s}
            </li>
          ))}
        </ul>
        <EChart option={trendOption} label={trendLabel} height={320} />
      </ChartCard>

      <div className={styles.split}>
        <ChartCard
          id="chartSource"
          title="에너지원별 비중"
          desc={`${year}년 · ${scope}`}
          table={
            <table className={styles.table}>
              <caption className="sr-only">
                {year}년 {scope} 에너지원별 발전량과 비중
              </caption>
              <thead>
                <tr>
                  <th scope="col">에너지원</th>
                  <th scope="col">발전량(GWh)</th>
                  <th scope="col">비중</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((s) => (
                  <tr key={s.source}>
                    <th scope="row">{s.source}</th>
                    <td>{fmt(s.value)}</td>
                    <td>{fmtPct(s.share)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        >
          <div className={styles.donut}>
            <EChart option={sourceOption} label={sourceLabel} height={240} />
            {/* 범례 겸 값 — 색만으로 구분하지 않도록 이름 · 값 · 비중을 글자로 함께 */}
            <ul className={styles.sourceList} aria-hidden="true">
              {[...sources]
                .sort((a, b) => b.value - a.value)
                .map((s) => (
                  <li key={s.source}>
                    <span className={styles.sourceName}>
                      <span className={styles.sourceDot} style={{ background: SOURCE_COLOR[s.source] }} />
                      {s.source}
                    </span>
                    <span className={styles.sourceShare}>{fmtPct(s.share)}</span>
                    <span className={styles.sourceValue}>{fmt(s.value)} GWh</span>
                  </li>
                ))}
            </ul>
          </div>
        </ChartCard>

        <ChartCard
          id="chartRegion"
          title="시도별 발전량"
          desc={`${year}년 · 많은 순 · 막대를 누르면 그 지역으로 바뀝니다`}
          table={
            <table className={styles.table}>
              <caption className="sr-only">{year}년 시도별 발전량 순위</caption>
              <thead>
                <tr>
                  <th scope="col">순위</th>
                  <th scope="col">시도</th>
                  <th scope="col">발전량(GWh)</th>
                  <th scope="col">전국 대비</th>
                </tr>
              </thead>
              <tbody>
                {regions.map((r, i) => (
                  <tr key={r.region} className={clsx(r.region === region && styles.current)}>
                    <td>{i + 1}</td>
                    <th scope="row">{r.region}</th>
                    <td>{fmt(r.total)}</td>
                    <td>{fmtPct(r.total / nationTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        >
          <EChart
            option={regionOption}
            label={regionLabel}
            height={460}
            onItemClick={({ name }) => setFilter('region', name === region ? ALL : name)}
          />
        </ChartCard>
      </div>

      <TextNote>본 통계는 포트폴리오 시연을 위한 가상 데이터이며 실제 통계와 다릅니다. 재생에너지 발전량 기준, 단위 GWh(기가와트시).</TextNote>
    </div>
  );
}
