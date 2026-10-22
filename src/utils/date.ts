/** 2026.10.20 → 2026-10-20 (time datetime 속성용) — Handlebars `isoDate` 헬퍼 대응 */
export function isoDate(d: string): string {
  return d.replaceAll('.', '-');
}

/** ISO 시각(서버) → 2026.10.20 (한국 시간 기준) */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const parts = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('year')}.${get('month')}.${get('day')}`;
}
