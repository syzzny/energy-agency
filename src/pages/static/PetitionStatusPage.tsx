import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { SectionBlock } from '@/components/SectionBlock';
import { InfoTable } from '@/components/Article';
import { Tracker, type TrackerStep } from '@/components/Tracker';
import { CtaBanner } from '@/components/InfoBanner';
import { formStyles as f } from '@/components/Form';
import tableStyles from '@/components/DataTable/DataTable.module.scss';
import { useLookup } from '@/hooks';

const TRACKER_STEPS: TrackerStep[] = [
  { label: '접수', status: 'done', time: '2026-10-21T09:12', timeLabel: '10.21 09:12' },
  { label: '부서 배정', status: 'done', time: '2026-10-21T11:40', timeLabel: '10.21 11:40' },
  { label: '처리중', status: 'current' },
  { label: '답변 완료', status: 'wait' },
];

const HISTORY = [
  { time: '2026.10.22 10:05', content: '시공 참여기업에 설치 확인서 제출 여부 확인 요청', by: '재생에너지보급실' },
  { time: '2026.10.21 11:40', content: '담당 부서 배정', by: '홍보소통실' },
  { time: '2026.10.21 09:12', content: '온라인 민원 접수', by: '시스템' },
];

export default function PetitionStatusPage() {
  const lookup = useLookup<HTMLElement>();

  return (
    <>
      <SectionBlock id="lookup" title="처리현황 조회" desc="민원 신청 시 받은 접수번호와 신청인 정보를 입력해 주세요.">
        <form className={f.lookup} onSubmit={lookup.onSubmit}>
          <div className={f.field}>
            <label className={f.fieldLabel} htmlFor="receiptNo">
              접수번호
            </label>
            <input type="text" id="receiptNo" className={f.input} defaultValue="2026-1021-0384" />
          </div>
          <div className={f.field}>
            <label className={f.fieldLabel} htmlFor="lookupName">
              신청인 이름
            </label>
            <input type="text" id="lookupName" className={f.input} defaultValue="홍길동" autoComplete="name" />
          </div>
          <div className={f.field}>
            <label className={f.fieldLabel} htmlFor="lookupTel">
              휴대전화 끝 4자리
            </label>
            <input type="tel" id="lookupTel" className={f.input} inputMode="numeric" maxLength={4} defaultValue="5678" />
          </div>
          <Button type="submit" icon="search" iconFirst>
            조회
          </Button>
        </form>
      </SectionBlock>

      <SectionBlock
        id="result"
        title="조회 결과"
        aside={<Badge label="처리중" variant="solid" />}
        tabIndex={-1}
        sectionRef={lookup.resultRef}
      >
      <InfoTable
            caption="민원 신청 정보 — 접수번호, 제목, 민원 분야, 처리 부서, 처리 기한"
            rows={[
              ['접수번호', <span className="num">2026-1021-0384</span>],
              ['제목', '주택 태양광 설치 후 보조금 지급 일정 문의'],
              ['민원 분야', '재생에너지 보급지원'],
              [
                '처리 부서',
                <>
                  재생에너지보급실 (담당자 <span className="num">051-000-0201</span>)
                </>,
              ],
              [
                '처리 기한',
                <>
                  <span className="num">2026.10.28</span> 까지 (접수일로부터 7일)
                </>,
              ],
            ]}
          />

          <Tracker steps={TRACKER_STEPS} />

          <div className={tableStyles.wrap} tabIndex={0} role="region" aria-label="처리 이력 표">
            <table className={tableStyles.table}>
              <caption>처리 이력 — 일시, 처리 내용, 처리자</caption>
              <colgroup>
                <col style={{ width: '180px' }} />
                <col />
                <col style={{ width: '180px' }} />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">일시</th>
                  <th scope="col">처리 내용</th>
                  <th scope="col">처리자</th>
                </tr>
              </thead>
              <tbody>
                {HISTORY.map((h) => (
                  <tr key={h.time}>
                    <td className="num">{h.time}</td>
                    <td className={tableStyles.taL}>{h.content}</td>
                    <td>{h.by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </SectionBlock>

      <CtaBanner
        title="접수번호를 잊으셨나요?"
        desc={
          <>
            민원 접수 시 발송된 문자를 확인하거나 고객센터(<a href="tel:1600-0000" className="num">1600-0000</a>)로 문의해 주세요.
          </>
        }
        action={
          <Button href="/participation/petition" variant="dark" pill icon="arrow">
            새 민원 신청
          </Button>
        }
      />
    </>
  );
}
