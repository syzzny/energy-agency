-- ============================================================
-- 묻고 답하기 테이블 (/support/qna)
--  새 Supabase 프로젝트에서 처음부터 만들 때: qna.sql → auth_qna.sql → energy_stats.sql 순서로 실행
-- ============================================================

create table qna (
  id bigint generated always as identity primary key,
  title text not null check (char_length(title) between 2 and 100),
  content text not null check (char_length(content) between 5 and 4000),
  writer text not null,
  is_private boolean not null default false,
  status text not null default '접수' check (status in ('접수', '처리중', '답변완료')),
  answer text,
  answer_dept text,
  answered_at timestamptz,
  created_at timestamptz not null default now()
);

-- RLS: 규칙에 맞는 요청만 통과시킨다
alter table qna enable row level security;
create policy "누구나 질문 등록 (접수 상태만)" on qna for insert with check (status = '접수');

-- 공개용 뷰: 비공개 글은 내용과 답변을 비워서 보여 준다
--  원본 테이블은 직접 읽지 못하게 하고, 목록 · 상세 조회는 이 뷰로만 한다
create view qna_public as
select
  id, title,
  case when is_private then null else content end as content,
  writer, is_private, status,
  case when is_private then null else answer end as answer,
  answer_dept, answered_at, created_at
from qna;

revoke select on qna from anon, authenticated;
grant select on qna_public to anon, authenticated;

-- 예시 글
insert into qna (title, content, writer, is_private, status, answer, answer_dept, answered_at) values
  ('에너지바우처 카드 사용처가 궁금합니다', '올해 받은 에너지바우처 카드로 어디에서 결제할 수 있는지 알고 싶습니다.', '홍**', false, '답변완료',
   '안녕하세요. 에너지전환진흥원입니다.
에너지바우처 카드는 전기 · 도시가스 · 지역난방 요금 차감 또는 등유 · LPG · 연탄 구매에 사용할 수 있습니다.', '에너지복지실', now()),
  ('주택 태양광 보조금 신청 기간 문의', '하반기 주택 태양광 보급지원 신청 기간이 언제까지인가요?', '김**', false, '처리중', null, null, null),
  ('그린리모델링 시공업체 선정 관련', '시공업체를 직접 골라도 지원받을 수 있는지 궁금합니다.', '이**', false, '접수', null, null, null),
  ('비공개 문의드립니다', '개인 정보가 포함된 문의라 비공개로 남깁니다.', '박**', true, '접수', null, null, null);
