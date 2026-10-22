-- ============================================================
-- 회원 기능: 질문을 작성자 계정에 연결하고, 비공개 글은 본인만 보게 한다
--  (energy_stats.sql 과 마찬가지로 Supabase SQL Editor 에서 한 번 실행)
-- ============================================================

-- 1) 작성자 칸 — 로그인한 상태로 등록하면 자동으로 그 계정 id 가 들어간다 (손님이면 비어 있음)
alter table qna
  add column if not exists user_id uuid references auth.users (id) on delete set null default auth.uid();

-- 2) 등록 규칙: '접수' 상태만, 그리고 남의 계정 id 로는 등록할 수 없다
drop policy if exists "누구나 질문 등록 (접수 상태만)" on qna;
drop policy if exists "질문 등록 (접수 상태 · 본인 계정만)" on qna;
create policy "질문 등록 (접수 상태 · 본인 계정만)" on qna
  for insert
  with check (status = '접수' and (user_id is null or user_id = auth.uid()));

-- 3) 조회 규칙: 원본 테이블은 로그인한 '본인 글'만 (비공개 글 내용 · 답변 포함)
--    다른 사람들은 지금처럼 공개용 뷰(qna_public)로만 본다
drop policy if exists "누구나 목록 조회" on qna;
drop policy if exists "본인 글 조회" on qna;
create policy "본인 글 조회" on qna
  for select to authenticated
  using (user_id = auth.uid());
grant select on qna to authenticated;
