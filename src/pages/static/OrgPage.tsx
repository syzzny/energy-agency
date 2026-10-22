import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Button } from '@/components/Button';
import { formStyles } from '@/components/Form';
import { SectionBlock } from '@/components/SectionBlock';
import tableStyles from '@/components/DataTable/DataTable.module.scss';
import styles from './OrgPage.module.scss';

const DIVISIONS = [
  { name: '경영기획본부', teams: ['경영기획실', '인사총무팀', '예산재무팀', '계약관리팀'] },
  { name: '보급사업본부', teams: ['재생에너지보급실', '풍력사업팀', '효율개선팀', '에너지복지팀'] },
  { name: '미래에너지본부', teams: ['수소산업팀', '데이터전략팀', '홍보소통실'] },
];

const DEPARTMENTS = [
  { division: '경영기획본부', team: '경영기획실', duty: '경영계획 수립, 이사회 운영, 경영평가', tel: '051-000-0101' },
  { division: '경영기획본부', team: '인사총무팀', duty: '채용, 인사·복무, 시설 관리', tel: '051-000-0102' },
  { division: '경영기획본부', team: '계약관리팀', duty: '입찰·계약, 수의계약 공개', tel: '051-000-0104' },
  { division: '보급사업본부', team: '재생에너지보급실', duty: '주택·건물 태양광 보급지원, 참여기업 관리', tel: '051-000-0201' },
  { division: '보급사업본부', team: '풍력사업팀', duty: '해상풍력 인프라, 주민참여형 단지 지원', tel: '051-000-0202' },
  { division: '보급사업본부', team: '효율개선팀', duty: '건물 에너지효율 개선, 녹색건축 인증', tel: '051-000-0203' },
  { division: '보급사업본부', team: '에너지복지팀', duty: '에너지바우처, 취약계층 지원', tel: '051-000-0204' },
  { division: '미래에너지본부', team: '수소산업팀', duty: '청정수소 생산·충전 인프라 지원', tel: '051-000-0301' },
  { division: '미래에너지본부', team: '데이터전략팀', duty: '에너지 통계, 공공데이터 개방', tel: '051-000-0302' },
  { division: '미래에너지본부', team: '홍보소통실', duty: '보도자료, 누리집·SNS 운영, 민원 총괄', tel: '051-000-0303' },
];

export default function OrgPage() {
  const [division, setDivision] = useState('전체 본부');
  const [keyword, setKeyword] = useState('');

  const filtered = useMemo(
    () =>
      DEPARTMENTS.filter(
        (d) => (division === '전체 본부' || d.division === division) && (!keyword.trim() || d.duty.includes(keyword.trim()) || d.team.includes(keyword.trim())),
      ),
    [division, keyword],
  );

  return (
    <>
      <SectionBlock id="org" title="조직도">
        <div className={styles.orgChart}>
          <div className={styles.head}>
            <p className={styles.ceo}>원장</p>
            <p className={styles.side}>감사실</p>
          </div>
          <div className={styles.divisions}>
            {DIVISIONS.map((d) => (
              <div key={d.name} className={styles.division}>
                <h4>{d.name}</h4>
                <ul>
                  {d.teams.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </SectionBlock>

      <SectionBlock id="dept" title="부서별 업무 및 연락처" desc="담당 업무를 검색하면 문의할 부서를 빠르게 찾을 수 있습니다.">
        <form className={styles.deptFilter} role="search" onSubmit={(e) => e.preventDefault()}>
          <label className={clsx(formStyles.select, styles.deptSelect)}>
            <span className="sr-only">본부 선택</span>
            <select value={division} onChange={(e) => setDivision(e.target.value)}>
              <option>전체 본부</option>
              {DIVISIONS.map((d) => (
                <option key={d.name}>{d.name}</option>
              ))}
            </select>
          </label>
          <label htmlFor="dutyKeyword" className="sr-only">
            담당 업무 검색어
          </label>
          <input
            type="search"
            id="dutyKeyword"
            className={clsx(formStyles.input, styles.deptInput)}
            placeholder="담당 업무를 입력해 주세요 (예: 바우처)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {/* 입력하는 즉시 걸러지지만, 키보드·스크린리더 사용자를 위해 검색 버튼도 둔다 */}
          <Button type="submit" icon="search" iconFirst>
            검색
          </Button>
        </form>

        <div className={tableStyles.wrap} tabIndex={0} role="region" aria-label="부서별 업무 및 연락처 표">
          <table className={tableStyles.table}>
            <caption>부서별 담당 업무 및 연락처 — 본부, 부서, 담당 업무, 전화번호</caption>
            <colgroup>
              <col style={{ width: '140px' }} />
              <col style={{ width: '160px' }} />
              <col />
              <col style={{ width: '150px' }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">본부</th>
                <th scope="col">부서</th>
                <th scope="col">담당 업무</th>
                <th scope="col">전화번호</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.team}>
                  <td className={tableStyles.muted}>{d.division}</td>
                  <th scope="row">{d.team}</th>
                  <td className={tableStyles.taL}>{d.duty}</td>
                  <td className="num">{d.tel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionBlock>
    </>
  );
}
