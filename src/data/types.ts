// ============================================================
// 데이터 타입 정의 — src/data/json/*.json 각각의 shape
// ============================================================

/** menu.json — GNB 1depth */
export interface MenuChild {
  id: string;
  name: string;
  href: string;
}
export interface MenuNode {
  id: string;
  name: string;
  children: MenuChild[];
  visual: string;
}

/** disclosureCategories.json / faqCategories.json / recruitStatus.json 공통 shape */
export interface Category {
  key: string;
  label: string;
  count: number;
}

/** business.json */
export interface BusinessFact {
  icon: string;
  label: string;
  value: string;
}
export interface BusinessTableCol {
  label: string;
  width: string | null;
  style: string | null;
}
export interface BusinessSupport {
  desc: string;
  caption: string;
  cols: BusinessTableCol[];
  rows: string[][];
}
export interface BusinessStep {
  title: string;
  desc: string;
}
export interface BusinessContact {
  dept: string;
  tel: string;
  email: string;
}
export interface BusinessCard {
  tag: string;
  name: string;
  summary: string;
  img: string;
}
export interface BusinessItem {
  id: string;
  image: string;
  badge: string;
  title: string;
  desc: string;
  cta: { label: string; href: string };
  guide: { label: string; file: string };
  facts: BusinessFact[];
  overview: string;
  support: BusinessSupport;
  processTitle: string;
  steps: BusinessStep[];
  contact: BusinessContact;
  dept: string;
  card: BusinessCard;
}

/** cardnews.json — 카드뉴스 한 편과 장(slide)별 내용. 장마다 레이아웃 종류(type)가 다르다 */
export type CardnewsTone = 'mint' | 'blue' | 'warm' | 'navy' | 'green';
export type CardnewsSlide =
  | { type: 'cover'; title: string; sub: string }
  | { type: 'qa'; q: string; a: string }
  | { type: 'stat'; label: string; value: string; unit: string; caption: string }
  | { type: 'list'; title: string; items: string[] }
  | { type: 'steps'; title: string; steps: { t: string; d: string }[] }
  | { type: 'end'; title: string; body: string; cta: string };
export interface CardnewsItem {
  id: string;
  title: string;
  date: string;
  pages: number;
  tone: CardnewsTone;
  image: string;
  /** 표지 상단 주제 태그 */
  topic: string;
  slides: CardnewsSlide[];
  /** 상세 페이지 하단 '관련 정보' 링크 */
  related: { label: string; to: string };
}

/** disclosure.json */
export interface DisclosureItem {
  no: string;
  category: string; // ref: DisclosureCategory.key
  categoryLabel: string;
  title: string;
  cycle: string;
  time: string;
  dept: string;
  linkLabel: string;
}
export type DisclosureCategory = Category;

/** faq.json */
export interface FaqItem {
  id: string;
  category: string; // ref: FaqCategory.key
  categoryLabel: string;
  q: string;
  a: string;
  open: boolean;
}
export type FaqCategory = Category;

/** notices.json */
export interface NoticeItem {
  id: string;
  no: string | null;
  pinned: boolean;
  category: string; // free label, no taxonomy file
  title: string;
  isNew: boolean;
  attach: boolean;
  date: string;
  hits: string;
}

/** 상세 페이지 전용 원문 (대표 게시물에만 있음 — 없으면 요약으로 본문을 구성) */
export interface AttachmentData {
  name: string;
  size: string;
}
export type ArticleBlock = { type: 'p' | 'h4'; text: string };

/** press.json */
export interface PressDetail {
  files: AttachmentData[];
  figure: { alt: string; caption: string };
  blocks: ArticleBlock[];
}
export interface PressItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  dept: string;
  attach: boolean;
  image: string;
  detail?: PressDetail;
}

/** qna.json */
export type QnaStatus = '접수' | '처리중' | '답변완료';
export interface QnaItem {
  no: string;
  title: string;
  private: boolean;
  writer: string;
  date: string;
  status: QnaStatus;
  detail?: { question: string[]; dept: string; answerDate: string; answer: string[] };
}

/** quick.json */
export interface QuickLink {
  label: string;
  icon: string;
  href: string;
}

/** recruit.json */
export interface RecruitItem {
  id: string;
  status: string; // ref: RecruitStatus.key
  type: string;
  title: string;
  period: string;
  field: string;
  dday: string;
  date: string;
  detail?: { noticeFile: string; field: string; period: string };
}
export type RecruitStatus = Category;

/** stats.json */
export interface StatItem {
  label: string;
  icon: string;
  value: string;
  unit: string;
  desc: string;
  highlight: boolean;
}
