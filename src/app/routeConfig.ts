/** 라우트 handle — SubLayout/Header가 useMatches()로 읽어 breadcrumb/LNB/GNB 강조를 그린다 */
export interface RouteHandle {
  gnbId: string;
  /** business 상세처럼 :id 로 동적으로 결정되는 경우 null */
  lnbId: string | null;
  /** 지정하면 sub-layout의 기본 타이틀(2depth 이름) 대신 이 값을 쓴다 */
  title?: string;
  contentClass?: string;
}
