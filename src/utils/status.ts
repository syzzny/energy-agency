export type BadgeVariant = 'default' | 'primary' | 'solid' | 'green' | 'glass';

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  처리중: 'primary',
  답변완료: 'green',
  공지: 'primary',
};

/** 상태·분류 → 배지 색 — Handlebars `statusVariant` 헬퍼 대응 */
export function statusVariant(status: string): BadgeVariant | null {
  return STATUS_VARIANT[status] ?? null;
}
