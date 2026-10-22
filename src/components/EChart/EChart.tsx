import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { BarChart, PieChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';
import type { ComposeOption } from 'echarts/core';
import type { BarSeriesOption, PieSeriesOption } from 'echarts/charts';
import type { GridComponentOption, TooltipComponentOption } from 'echarts/components';
import styles from './EChart.module.scss';

// 필요한 차트·컴포넌트만 등록해 번들을 줄인다 (echarts 전체 import 대비 약 1/3)
echarts.use([BarChart, PieChart, GridComponent, TooltipComponent, SVGRenderer]);

export type EChartOption = ComposeOption<BarSeriesOption | PieSeriesOption | GridComponentOption | TooltipComponentOption>;

export interface EChartProps {
  option: EChartOption;
  /** 차트가 말하는 내용을 한 문장으로 — 스크린리더는 그림 대신 이 문장을 읽는다 */
  label: string;
  height: number | string;
  onItemClick?: (params: { name: string; dataIndex: number; seriesName?: string }) => void;
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * ECharts 를 React 에서 쓰기 위한 얇은 래퍼
 * - 마운트 때 한 번 init, 옵션이 바뀌면 setOption 으로 다시 그림, 언마운트 때 dispose
 * - 부모 너비가 바뀌면(ResizeObserver) 다시 맞춤 — 창 크기뿐 아니라 레이아웃 변화에도 반응
 * - SVG 렌더러: 글자가 선명하고 인쇄·확대에 강하다
 */
export function EChart({ option, label, height, onItemClick }: EChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const chart = useRef<echarts.ECharts>();
  const clickRef = useRef(onItemClick);
  clickRef.current = onItemClick;

  useEffect(() => {
    const el = ref.current!;
    const instance = echarts.init(el, undefined, { renderer: 'svg' });
    chart.current = instance;
    instance.on('click', (p) => clickRef.current?.(p as never));
    const ro = new ResizeObserver(() => instance.resize());
    ro.observe(el);
    return () => {
      ro.disconnect();
      instance.dispose();
    };
  }, []);

  useEffect(() => {
    chart.current?.setOption({ animation: !reducedMotion(), ...option }, { notMerge: true });
  }, [option]);

  return (
    <div className={styles.frame} role="img" aria-label={label}>
      <div ref={ref} className={styles.canvas} style={{ height }} />
    </div>
  );
}
