import type { MenuChild, MenuNode } from '@/data/types';

/** 1depth 찾기 — Handlebars `depth1` 헬퍼 대응 */
export function depth1(menu: MenuNode[], gnbId: string | undefined): MenuNode | undefined {
  return menu.find((m) => m.id === gnbId);
}

/** 2depth 찾기 — Handlebars `depth2` 헬퍼 대응 */
export function depth2(menu: MenuNode[], gnbId: string | undefined, lnbId: string | undefined): MenuChild | undefined {
  return depth1(menu, gnbId)?.children.find((c) => c.id === lnbId);
}

/** gnbId/lnbId → 라우트 경로. 모든 메뉴가 `/{gnbId}/{lnbId}` 한 형태로 통일된다(사업 상세 포함: `/business/solar`). */
export function menuPath(gnbId: string, lnbId: string): string {
  return `/${gnbId}/${lnbId}`;
}
