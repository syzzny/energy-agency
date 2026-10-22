/** 배열 앞에서 n개 — Handlebars `take` 헬퍼 대응 */
export function take<T>(arr: T[], n: number): T[] {
  return arr.slice(0, n);
}

/** 배열에서 id로 찾기 — Handlebars `find` 헬퍼 대응 */
export function findById<T extends { id: string }>(arr: T[], id: string | undefined): T | undefined {
  return arr.find((x) => x.id === id);
}

/** 조건에 맞는 항목만 — Handlebars `where` 헬퍼 대응 */
export function where<T, K extends keyof T>(arr: T[], key: K, value: T[K]): T[] {
  return arr.filter((x) => x[key] === value);
}
