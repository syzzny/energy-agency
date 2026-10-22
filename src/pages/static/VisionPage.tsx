import { Icon } from '@/components/Icon';
import { IntroGroup, SectionBlock } from '@/components/SectionBlock';
import { Survey } from '@/components/Survey';
import { imageUrl } from '@/utils/asset';
import styles from './VisionPage.module.scss';

const VALUES = [
  { icon: 'heart', en: 'People', title: '국민중심', desc: '국민의 눈높이에서 사업을 설계하고 성과를 나눕니다.' },
  { icon: 'spark', en: 'Innovation', title: '혁신', desc: '데이터와 기술로 일하는 방식을 끊임없이 바꿉니다.' },
  { icon: 'hand', en: 'Partnership', title: '상생', desc: '지역·기업과 함께 성장하는 전환 생태계를 만듭니다.' },
  { icon: 'shield', en: 'Integrity', title: '책임', desc: '투명하고 공정한 경영으로 국민의 신뢰를 지킵니다.' },
];

const STRATEGY = [
  { title: '재생에너지 보급 가속화', tasks: ['주택·건물 태양광 확대', '주민참여형 풍력단지', '지역 분산에너지 기반'] },
  { title: '에너지 효율 혁신', tasks: ['노후건물 그린리모델링', '산업단지 효율 진단', '수요관리 플랫폼 고도화'] },
  { title: '미래 에너지 생태계 조성', tasks: ['청정수소 인프라 확충', '에너지 신산업 창업 지원', '전환 기술 실증 확대'] },
  { title: '신뢰받는 책임경영', tasks: ['안전·윤리경영 강화', 'ESG 경영 내재화', '데이터 기반 열린 행정'] },
];

export default function VisionPage() {
  return (
    <>
      <IntroGroup>
        <section className={styles.mission} aria-labelledby="missionLabel">
          <img className={styles.missionImg} src={imageUrl('3d-globe')} alt="" width={480} height={480} loading="lazy" />
          <h3 className={styles.missionLabel} id="missionLabel">
            <span lang="en">MISSION</span> · 미션
          </h3>
          <p className={styles.missionText}>
            재생에너지와 효율 혁신으로 <br />
            국민의 탄소중립 일상을 실현한다
          </p>
        </section>

        <section className={styles.vision} aria-labelledby="visionLabel">
          <img className={styles.visionBg} src={imageUrl('photo-tower')} alt="" width={1376} height={768} loading="lazy" />
          <h3 className={styles.visionLabel} id="visionLabel">
            <span lang="en">VISION 2030</span> · 비전
          </h3>
          <p className={styles.visionText}>
            국민이 체감하는 <br />
            에너지전환 선도기관
          </p>
          <ul className={styles.visionTargets} aria-label="2030 정량 목표">
            <li>재생에너지 비중 40%</li>
            <li>에너지 소비 15% 절감</li>
            <li>온실가스 1,000만 톤 감축</li>
          </ul>
        </section>
      </IntroGroup>

      <SectionBlock id="values" title="핵심가치">
        <ul className={styles.values}>
          {VALUES.map((v) => (
            <li key={v.title} className={styles.valuesItem}>
              <span className={styles.valuesIcon} aria-hidden="true">
                <Icon name={v.icon} />
              </span>
              <div>
                <small lang="en">{v.en}</small>
                <h4>{v.title}</h4>
              </div>
              <p>{v.desc}</p>
            </li>
          ))}
        </ul>
      </SectionBlock>

      <SectionBlock id="strategy" title="전략목표 및 전략과제" desc="4대 전략목표 아래 12개 전략과제를 추진합니다.">
        <ol className={styles.strategy}>
          {STRATEGY.map((s, i) => (
            <li key={s.title} className={styles.strategyItem}>
              <h4 className={styles.strategyGoal}>
                <span className={styles.strategyNum} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {s.title}
              </h4>
              <ul className={styles.strategyTasks} aria-label="전략과제">
                {s.tasks.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </SectionBlock>

      <Survey dept="경영기획실" />
    </>
  );
}
