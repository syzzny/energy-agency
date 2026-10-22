import { useMatches, useParams } from 'react-router-dom';
import type { RouteHandle } from './routeConfig';

/** 현재 매치된 라우트 중 gnbId를 가진 handle을 찾아 반환. business/:id처럼 lnbId가 없으면 :id로 대체 */
export function useRouteHandle(): RouteHandle | null {
  const matches = useMatches();
  const params = useParams();

  const match = [...matches].reverse().find((m) => (m.handle as RouteHandle | undefined)?.gnbId);
  const handle = match?.handle as RouteHandle | undefined;
  if (!handle) return null;

  return { ...handle, lnbId: handle.lnbId ?? params.id ?? null };
}
