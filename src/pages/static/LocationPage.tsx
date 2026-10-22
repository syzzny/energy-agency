import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { IntroGroup, SectionBlock } from '@/components/SectionBlock';
import { FeatureCards } from '@/components/FeatureCards';
import { useCopyToClipboard } from '@/hooks';
import styles from './LocationPage.module.scss';

export default function LocationPage() {
  const copy = useCopyToClipboard();

  return (
    <>
      <IntroGroup>
        {/* 지도 영역: 실서비스에서는 카카오맵/네이버지도 API로 교체 */}
        <div className={styles.map}>
          <svg
            viewBox="0 0 904 420"
            preserveAspectRatio="xMidYMid slice"
            role="img"
            aria-label="에너지전환진흥원 위치 지도: 해운대구 센텀중앙로, 센텀시티역 3번 출구에서 도보 5분"
          >
            <rect width="904" height="420" fill="#EEF2F6" />
            <path d="M0 330c120-30 200 10 320-10s200-60 340-40 180 50 244 40v100H0z" fill="#CFE3F7" />
            <g fill="#E1E7EF">
              <rect x="60" y="40" width="180" height="110" rx="10" />
              <rect x="560" y="40" width="160" height="100" rx="10" />
              <rect x="620" y="180" width="200" height="90" rx="10" />
              <rect x="90" y="190" width="150" height="90" rx="10" />
            </g>
            <rect x="300" y="60" width="140" height="120" rx="12" fill="#D6F0E3" />
            <g stroke="#fff" strokeLinecap="round">
              <path d="M0 170h904M450 0v330M0 290h904" strokeWidth="22" />
              <path d="M260 0l60 420M720 0l-40 330" strokeWidth="12" />
            </g>
            <path d="M0 170h904" stroke="#FFD66B" strokeWidth="3" strokeDasharray="14 10" />
            <circle cx="560" cy="170" r="10" fill="#9B5DE5" />
            <circle cx="560" cy="170" r="4" fill="#fff" />
            <text x="576" y="160" fontSize="13" fontFamily="sans-serif" fill="#5c6375">
              센텀시티역
            </text>
            <text x="330" y="125" fontSize="13" fontFamily="sans-serif" fill="#3d7a5f">
              APEC 나루공원
            </text>
          </svg>
          <p className={styles.pin} aria-hidden="true">
            <span>에너지전환진흥원</span>
            <Icon name="pin" />
          </p>
          <div className={styles.mapLinks}>
            <Button href="#" variant="light" size="sm" pill external>
              카카오맵<span className="sr-only">에서 보기</span>
            </Button>
            <Button href="#" variant="light" size="sm" pill external>
              네이버지도<span className="sr-only">에서 보기</span>
            </Button>
          </div>
        </div>

        <div className={styles.addressCard}>
          <dl>
            <div>
              <dt>주소</dt>
              <dd id="addressText">(48058) 부산광역시 해운대구 센텀중앙로 00, 에너지전환진흥원</dd>
            </div>
            <div>
              <dt>대표전화</dt>
              <dd>
                <a href="tel:1600-0000" className="num">
                  1600-0000
                </a>
              </dd>
            </div>
            <div>
              <dt>운영시간</dt>
              <dd>평일 09:00 ~ 18:00 (토·일·공휴일 휴무)</dd>
            </div>
          </dl>
          <Button
            variant="line"
            size="sm"
            pill
            icon="copy"
            iconFirst
            onClick={() => copy(document.getElementById('addressText')?.textContent, '주소가 복사되었습니다.')}
          >
            주소 복사
          </Button>
        </div>
      </IntroGroup>

      <SectionBlock id="transit" title="교통 안내">
        <FeatureCards
          items={[
            {
              icon: 'train',
              title: '지하철',
              content: (
                <ul>
                  <li>2호선 센텀시티역 3번 출구 도보 5분</li>
                  <li>동해선 센텀역 1번 출구 도보 10분</li>
                </ul>
              ),
            },
            {
              icon: 'bus',
              title: '버스',
              content: (
                <ul>
                  <li>센텀시티역 정류장 하차</li>
                  <li>
                    간선 <span className="num">39, 40, 63, 141</span>
                  </li>
                  <li>
                    급행 <span className="num">1001, 1003</span>
                  </li>
                </ul>
              ),
            },
            {
              icon: 'car',
              title: '자가용 · 주차',
              content: (
                <ul>
                  <li>지하 1~3층 방문객 주차장 이용</li>
                  <li>민원 방문 시 2시간 무료</li>
                  <li>장애인 전용 주차구역 지하 1층</li>
                </ul>
              ),
            },
          ]}
        />
      </SectionBlock>
    </>
  );
}
