import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { IntroBox, CtaBanner } from '@/components/InfoBanner';
import { FeatureCards } from '@/components/FeatureCards';
import { SectionBlock } from '@/components/SectionBlock';
import { Steps } from '@/components/Steps';
import { DataTable } from '@/components/DataTable';
import tableStyles from '@/components/DataTable/DataTable.module.scss';
import { NoticeBox } from '@/components/NoticeBox';
import { Survey } from '@/components/Survey';

const FLOW_STEPS = [
  { title: '청구서 접수', desc: '온라인 · 방문 · 우편' },
  { title: '담당부서 이송', desc: '정보 보유 부서 지정' },
  { title: '공개 여부 결정', desc: '접수일로부터 10일 이내' },
  { title: '결정 통지', desc: '공개 · 부분공개 · 비공개' },
  { title: '정보 공개', desc: '열람 · 사본 · 전자파일' },
];

export default function InfoRequestPage() {
  return (
    <>
      <IntroBox icon="edit" title="정보공개 청구란?">
        누구든지 공공기관이 보유·관리하는 정보의 공개를 요청할 수 있는 제도입니다. 사전정보공표 목록에 없는 정보가 필요하면 아래 방법으로 청구해 주세요.
      </IntroBox>

      <SectionBlock id="method" title="청구 방법">
        <FeatureCards
          items={[
            {
              icon: 'monitor',
              title: '온라인 청구',
              content: (
                <>
                  <p>정보공개포털에 로그인한 뒤 기관명에 ‘에너지전환진흥원’을 선택해 청구서를 작성합니다.</p>
                  <Button href="https://www.open.go.kr" variant="primary" size="sm" pill icon="external" external>
                    정보공개포털 바로가기
                  </Button>
                </>
              ),
            },
            {
              icon: 'building',
              title: '방문 청구',
              content: (
                <ul>
                  <li>본원 1층 민원실 (평일 09:00 ~ 18:00)</li>
                  <li>신분증을 지참하고 청구서를 작성합니다.</li>
                </ul>
              ),
            },
            {
              icon: 'send',
              title: '우편 · 팩스 청구',
              content: (
                <>
                  <ul>
                    <li>청구서 서식을 내려받아 작성 후 발송</li>
                    <li>
                      팩스 <span className="num">051-000-0000</span>
                    </li>
                  </ul>
                  <Button href="#" variant="line" size="sm" pill icon="download" iconFirst srText="(HWP, 32KB)">
                    청구서 서식
                  </Button>
                </>
              ),
            },
          ]}
        />
      </SectionBlock>

      <SectionBlock id="flow" title="처리 절차" desc="청구를 받은 날부터 10일 이내에 공개 여부를 결정합니다. (부득이한 경우 10일 연장)">
        <Steps items={FLOW_STEPS} />
      </SectionBlock>

      <SectionBlock id="fee" title="수수료 안내">
        <DataTable
          caption="공개 방법별 수수료 — 공개 대상, 열람·시청, 사본·출력물, 전자파일"
          cols={[
            { label: '공개 대상', width: null, style: null },
            { label: '열람 · 시청', width: null, style: null },
            { label: '사본 · 출력물', width: null, style: null },
            { label: '전자파일', width: null, style: 'em' },
          ]}
          rows={[
            [
              '문서 · 도면 · 사진',
              '1일 1시간 이내 무료',
              <>
                A4 기준 1장 250원
                <br />
                <span className={tableStyles.muted}>(초과 1장당 50원)</span>
              </>,
              '무료',
            ],
            ['녹음 · 녹화물', '1편 1,500원', '1건 5,000원', '무료'],
          ]}
        />
        <NoticeBox variant="info">
          비공개 결정에 이의가 있으면 통지를 받은 날부터 30일 이내에 이의신청할 수 있으며, 행정심판 또는 행정소송도 제기할 수 있습니다.
        </NoticeBox>
      </SectionBlock>

      <CtaBanner
        title="찾는 정보가 이미 공개되어 있을 수도 있어요"
        desc="청구 전에 사전정보공표 목록을 먼저 확인해 보세요."
        action={
          <Button href="/info/disclosure" variant="dark" pill icon="arrow">
            사전정보공표 보기
          </Button>
        }
      />

      <Survey dept="데이터전략팀" />
    </>
  );
}
