import clsx from 'clsx';
import { Icon } from '@/components/Icon';
import { TextNote } from '@/components/TextNote';
import { usePageTools, useTabs } from '@/hooks';
import { imageUrl } from '@/utils/asset';
import chipStyles from '@/components/Badge/Badge.module.scss';
import subLayoutStyles from '@/layout/SubLayout/SubLayout.module.scss';
import styles from './PolicyPage.module.scss';

const TABS = [
  { id: 'privacy', label: '개인정보처리방침' },
  { id: 'terms', label: '이용약관' },
  { id: 'copyright', label: '저작권정책' },
  { id: 'email', label: '이메일무단수집거부' },
  { id: 'cctv', label: '영상정보처리기기 운영방침' },
];

export default function PolicyPage() {
  const { print } = usePageTools();
  const tabs = useTabs({ ids: TABS.map((t) => t.id) });

  return (
    <main id="content" tabIndex={-1}>
      <div className={subLayoutStyles.subVisual}>
        <img className={subLayoutStyles.subVisualBg} src={imageUrl('photo-green-city')} alt="" width={1376} height={768} fetchPriority="high" />
        <div className={clsx('container', subLayoutStyles.subVisualInner)}>
          <nav className={subLayoutStyles.breadcrumb} aria-label="현재 위치">
            <ol>
              <li>
                <a href="/">
                  <Icon name="home" />
                  <span className="sr-only">홈</span>
                </a>
              </li>
              <li aria-current="page">누리집 정책</li>
            </ol>
          </nav>
          <div className={subLayoutStyles.subVisualRow}>
            <h2 className={subLayoutStyles.subVisualTitle}>누리집 정책</h2>
            <div className={clsx(subLayoutStyles.pageTools, 'no-print')}>
              <button type="button" className={clsx(subLayoutStyles.pageToolsBtn, subLayoutStyles.pageToolsPrint)} onClick={print}>
                <Icon name="print" />
                <span className="sr-only">페이지 인쇄</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={clsx('container', styles.policy)}>
        <div className={styles.tabs} role="tablist" aria-label="정책 선택">
          {TABS.map((t, i) => (
            <button key={t.id} className={chipStyles.chip} {...tabs.getTabProps(t.id, i)}>
              {t.label}
            </button>
          ))}
        </div>

        <section className={styles.panel} {...tabs.getPanelProps('privacy')}>
          <p>
            에너지전환진흥원(이하 ‘진흥원’)은 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할
            수 있도록 다음과 같이 개인정보 처리방침을 수립·공개합니다.
          </p>
          <h3>제1조 (개인정보의 처리 목적)</h3>
          <p>진흥원은 다음의 목적을 위하여 개인정보를 처리하며, 목적 이외의 용도로는 이용하지 않습니다.</p>
          <ol>
            <li>민원 접수 및 처리 결과 통보</li>
            <li>지원사업 신청 접수, 자격 확인 및 보조금 지급</li>
            <li>누리집 회원 관리 및 서비스 제공</li>
          </ol>
          <h3>제2조 (개인정보의 처리 및 보유 기간)</h3>
          <p>
            진흥원은 법령에 따른 보유 기간 또는 정보주체로부터 동의받은 보유 기간 내에서 개인정보를 처리·보유합니다. 민원 처리 정보는 처리 완료 후 3년,
            지원사업 관련 정보는 사업 종료 후 5년간 보관합니다.
          </p>
          <h3>제3조 (개인정보 보호책임자)</h3>
          <p>
            개인정보 보호책임자: 경영기획본부장 / 담당부서: 경영기획실 (<span className="num">051-000-0101</span>, privacy@energy-agency.example)
          </p>
          <TextNote>시행일자: 2026년 9월 1일</TextNote>
        </section>

        <section className={styles.panel} {...tabs.getPanelProps('terms')}>
          <h3>제1조 (목적)</h3>
          <p>이 약관은 에너지전환진흥원이 제공하는 누리집 서비스의 이용 조건과 절차, 이용자와 진흥원의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.</p>
          <h3>제2조 (약관의 효력과 변경)</h3>
          <p>
            이 약관은 누리집에 게시함으로써 효력이 발생하며, 진흥원은 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있습니다. 변경 시 시행일 7일
            전부터 공지합니다.
          </p>
          <h3>제3조 (이용자의 의무)</h3>
          <ol>
            <li>타인의 정보를 도용하여 서비스를 이용해서는 안 됩니다.</li>
            <li>게시판에 타인의 명예를 훼손하거나 불법적인 내용을 게시해서는 안 됩니다.</li>
          </ol>
        </section>

        <section className={styles.panel} {...tabs.getPanelProps('copyright')}>
          <p>
            진흥원 누리집에서 제공하는 자료는 「저작권법」에 따라 보호받는 저작물입니다. 공공누리 유형이 표시된 저작물은 해당 유형의 이용 조건에 따라
            자유롭게 이용할 수 있습니다.
          </p>
          <p>제1유형: 출처표시 — 출처를 밝히면 상업적 이용과 변경이 가능합니다.</p>
          <p>
            공공누리 표시가 없는 저작물을 이용하려면 사전에 홍보소통실(<span className="num">051-000-0303</span>)과 협의해 주세요.
          </p>
        </section>

        <section className={styles.panel} {...tabs.getPanelProps('email')}>
          <p>
            본 누리집에 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의 기술적 장치를 이용하여 무단으로 수집되는 것을 거부하며, 이를 위반하면
            「정보통신망 이용촉진 및 정보보호 등에 관한 법률」에 따라 처벌받을 수 있습니다.
          </p>
          <p>
            <Icon name="info" />
            게시일: 2026년 3월 1일
          </p>
        </section>

        <section className={styles.panel} {...tabs.getPanelProps('cctv')}>
          <p>진흥원은 시설 안전과 화재 예방을 위해 본원 건물에 영상정보처리기기를 설치·운영하고 있습니다.</p>
          <ol>
            <li>설치 대수 및 위치: 출입구, 주차장, 복도 등 총 42대</li>
            <li>촬영 시간: 24시간 연속 촬영</li>
            <li>보관 기간: 촬영일로부터 30일 이내</li>
            <li>
              관리 책임자: 인사총무팀장 (<span className="num">051-000-0102</span>)
            </li>
          </ol>
        </section>
      </div>
    </main>
  );
}
