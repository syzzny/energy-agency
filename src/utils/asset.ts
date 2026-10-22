/** public/images, public/favicon.svg 등 정적 자산 경로를 base URL 기준으로 변환 */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}

export function imageUrl(key: string): string {
  return asset(`images/${key}.jpg`);
}
