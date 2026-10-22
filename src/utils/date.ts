/** 2026.10.20 → 2026-10-20 (time datetime 속성용) — Handlebars `isoDate` 헬퍼 대응 */
export function isoDate(d: string): string {
  return d.replaceAll('.', '-');
}
