-- ============================================================
-- 에너지 통계 대시보드용 테이블 (/info/stats)
--  연도(2019~2025) × 시도(17) × 에너지원(5) = 595행
--  ※ 포트폴리오용 가상 데이터입니다. 실제 통계가 아닙니다.
-- ============================================================

create table energy_stats (
  year int not null check (year between 2000 and 2100),
  region text not null,
  source text not null check (source in ('태양광', '풍력', '수력', '바이오', '기타')),
  generation_gwh numeric(10, 1) not null check (generation_gwh >= 0),
  primary key (year, region, source)
);

alter table energy_stats enable row level security;
create policy "누구나 통계 조회" on energy_stats for select using (true);

-- 가상 데이터 만들기
--  지역별 가중치(에너지원마다 다름) × 전국 기준 발전량 × 연도별 성장률 × 약간의 흔들림
with region_w (region, ord, w_solar, w_wind, w_hydro, w_bio, w_etc) as (
  values
    ('서울', 1, 0.5, 0.0, 0.3, 3, 8),   ('부산', 2, 1.0, 0.5, 0.1, 4, 6),
    ('대구', 3, 1.5, 0.0, 0.1, 2, 4),   ('인천', 4, 2.0, 2.0, 0.2, 6, 8),
    ('광주', 5, 1.0, 0.0, 0.1, 1, 2),   ('대전', 6, 0.6, 0.0, 0.1, 1, 2),
    ('울산', 7, 1.0, 1.0, 0.3, 6, 7),   ('세종', 8, 0.6, 0.0, 0.1, 1, 1),
    ('경기', 9, 8.0, 1.0, 6.0, 18, 20), ('강원', 10, 6.0, 26.0, 40.0, 7, 5),
    ('충북', 11, 7.0, 0.5, 18.0, 5, 4), ('충남', 12, 14.0, 2.0, 2.0, 12, 10),
    ('전북', 13, 16.0, 5.0, 3.0, 6, 5), ('전남', 14, 22.0, 20.0, 5.0, 8, 6),
    ('경북', 15, 15.0, 24.0, 14.0, 9, 7), ('경남', 16, 8.0, 4.0, 8.0, 8, 6),
    ('제주', 17, 4.0, 24.0, 0.0, 2, 3)
),
weights as (
  select region, ord, '태양광' as source, 1 as sord, w_solar as w from region_w
  union all select region, ord, '풍력', 2, w_wind from region_w
  union all select region, ord, '수력', 3, w_hydro from region_w
  union all select region, ord, '바이오', 4, w_bio from region_w
  union all select region, ord, '기타', 5, w_etc from region_w
),
-- 2019년 전국 발전량(GWh)과 연 성장률
national (source, base, growth, wobble) as (
  values ('태양광', 13000.0, 0.150, 0.03), ('풍력', 2700.0, 0.090, 0.05),
         ('수력', 6200.0, -0.005, 0.12), ('바이오', 10500.0, 0.020, 0.03),
         ('기타', 4800.0, 0.070, 0.04)
)
insert into energy_stats (year, region, source, generation_gwh)
select
  y,
  w.region,
  w.source,
  round((
    n.base * power(1 + n.growth, y - 2019)
    * w.w / sum(w.w) over (partition by w.source, y)
    * (1 + n.wobble * sin(w.ord * 7 + w.sord * 3 + y))
  )::numeric, 1)
from weights w
join national n on n.source = w.source
cross join generate_series(2019, 2025) as y;
