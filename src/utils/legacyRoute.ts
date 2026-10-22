/** 구 Handlebars 빌드의 상대 href(`sub/xxx.html`)를 새 라우트 경로로 변환한다 */
const MAP: Record<string, string> = {
  'index.html': '/',
  'sub/greeting.html': '/about/greeting',
  'sub/vision.html': '/about/vision',
  'sub/history.html': '/about/history',
  'sub/org.html': '/about/org',
  'sub/business-solar.html': '/business/solar',
  'sub/business-wind.html': '/business/wind',
  'sub/business-efficiency.html': '/business/efficiency',
  'sub/disclosure.html': '/info/disclosure',
  'sub/info-request.html': '/info/request',
  'sub/notice-list.html': '/news/notice',
  'sub/notice-view.html': '/news/notice',
  'sub/press.html': '/news/press',
  'sub/press-view.html': '/news/press',
  'sub/recruit.html': '/news/recruit',
  'sub/recruit-view.html': '/news/recruit',
  'sub/cardnews.html': '/news/cardnews',
  'sub/cardnews-view.html': '/news/cardnews',
  'sub/petition.html': '/participation/petition',
  'sub/petition-status.html': '/participation/status',
  'sub/faq.html': '/support/faq',
  'sub/qna.html': '/support/qna',
  'sub/qna-view.html': '/support/qna',
  'sub/location.html': '/support/location',
  'sub/policy.html': '/policy',
};

export function legacyRoute(href: string): string {
  if (href in MAP) return MAP[href];
  const withSub = `sub/${href}`;
  if (withSub in MAP) return MAP[withSub];
  return '/';
}
