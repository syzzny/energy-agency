import { getSupabase } from '@/lib/supabase';

/**
 * 묻고 답하기 API
 * - 조회는 공개용 뷰 `qna_public` 에서 한다. 비공개 글은 뷰가 본문·답변을 비워서 돌려준다.
 * - 등록은 원본 테이블 `qna` 에 한다. RLS 가 '접수' 상태로만 넣을 수 있게 막는다.
 */
export type QnaStatus = '접수' | '처리중' | '답변완료';

export interface Qna {
  id: number;
  title: string;
  content: string | null;
  writer: string;
  isPrivate: boolean;
  status: QnaStatus;
  answer: string | null;
  answerDept: string | null;
  answeredAt: string | null;
  createdAt: string;
}

interface QnaRow {
  id: number;
  title: string;
  content: string | null;
  writer: string;
  is_private: boolean;
  status: QnaStatus;
  answer: string | null;
  answer_dept: string | null;
  answered_at: string | null;
  created_at: string;
}

const toQna = (r: QnaRow): Qna => ({
  id: r.id,
  title: r.title,
  content: r.content,
  writer: r.writer,
  isPrivate: r.is_private,
  status: r.status,
  answer: r.answer,
  answerDept: r.answer_dept,
  answeredAt: r.answered_at,
  createdAt: r.created_at,
});

export type QnaSearchField = 'all' | 'title' | 'writer';

export interface QnaListParams {
  page: number;
  pageSize: number;
  keyword?: string;
  field?: QnaSearchField;
}

export interface QnaListResult {
  items: Qna[];
  total: number;
}

/** 검색어에서 PostgREST 필터 문법을 깨뜨리는 문자(쉼표·괄호·%)를 지운다 */
const cleanKeyword = (s: string) => s.replace(/[%,()*\\]/g, ' ').trim();

export async function fetchQnaList({ page, pageSize, keyword = '', field = 'all' }: QnaListParams, signal?: AbortSignal): Promise<QnaListResult> {
  const from = (page - 1) * pageSize;
  let query = getSupabase()
    .from('qna_public')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .range(from, from + pageSize - 1);

  const q = cleanKeyword(keyword);
  if (q) {
    if (field === 'title') query = query.ilike('title', `%${q}%`);
    else if (field === 'writer') query = query.ilike('writer', `%${q}%`);
    else query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%`);
  }
  if (signal) query = query.abortSignal(signal);

  const { data, error, count } = await query;
  if (error) throw error;
  return { items: (data as QnaRow[]).map(toQna), total: count ?? 0 };
}

export async function fetchQna(id: number, signal?: AbortSignal): Promise<Qna | null> {
  let query = getSupabase().from('qna_public').select('*').eq('id', id);
  if (signal) query = query.abortSignal(signal);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data ? toQna(data as QnaRow) : null;
}

export interface NewQna {
  title: string;
  content: string;
  writerName: string;
  isPrivate: boolean;
}

/** 작성자 이름은 첫 글자만 남기고 가린다 (예: 홍길동 → 홍**) */
export const maskName = (name: string) => {
  const n = name.trim();
  return n ? n[0] + '*'.repeat(Math.max(2, n.length - 1)) : '';
};

export async function createQna(input: NewQna): Promise<void> {
  const { error } = await getSupabase().from('qna').insert({
    title: input.title.trim(),
    content: input.content.trim(),
    writer: maskName(input.writerName),
    is_private: input.isPrivate,
    status: '접수',
  });
  if (error) throw error;
}

/** 서버 오류를 사용자에게 보여줄 문장으로 바꾼다 */
export function errorMessage(error: unknown): string {
  if (error instanceof Error && error.name === 'ConfigError') return '데이터 연결 설정이 아직 되어 있지 않아요. 관리자에게 문의해 주세요.';
  if (error instanceof TypeError) return '인터넷 연결을 확인한 뒤 다시 시도해 주세요.';
  const code = (error as { code?: string } | null)?.code;
  if (code === '23514') return '입력한 내용이 형식에 맞지 않아요. 제목은 2~100자, 내용은 5~4,000자로 입력해 주세요.';
  if (code === '42501') return '등록 권한이 없어요. 잠시 후 다시 시도해 주세요.';
  return '일시적인 오류로 불러오지 못했어요. 잠시 후 다시 시도해 주세요.';
}
