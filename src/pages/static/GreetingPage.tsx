import { Survey } from '@/components/Survey';
import { imageUrl } from '@/utils/asset';
import styles from './GreetingPage.module.scss';

export default function GreetingPage() {
  return (
    <>
      <div className={styles.greeting}>
        <figure className={styles.photo}>
          <div className={styles.thumb}>
            {/* AI로 생성한 가상 인물 사진입니다 (실존 인물 아님) */}
            <img src={imageUrl('photo-ceo')} alt="에너지전환진흥원장 한지윤" width={640} height={800} />
          </div>
          <figcaption>
            <strong>한지윤</strong>에너지전환진흥원장
          </figcaption>
        </figure>

        <div>
          <p className={styles.quote}>
            국민 한 분 한 분의 일상에서 <br />
            <em>에너지전환</em>을 체감할 수 있도록 하겠습니다.
          </p>
          <div className={styles.body}>
            <p>안녕하십니까. 에너지전환진흥원 누리집을 찾아 주신 여러분을 진심으로 환영합니다.</p>
            <p>
              에너지전환진흥원은 재생에너지 보급과 에너지 효율 혁신을 통해 탄소중립 사회로의 전환을 이끌어 가는 공공기관입니다. 기후위기는 더 이상 먼 미래의
              이야기가 아니며, 우리가 사용하는 에너지의 방식을 바꾸는 일은 지금 세대가 함께 풀어야 할 과제가 되었습니다.
            </p>
            <p>
              저희는 주택 지붕의 태양광부터 바다 위 풍력단지, 오래된 건물의 단열 개선까지 국민의 생활 가까이에서 변화를 만들어 가고 있습니다. 앞으로도
              지역과 기업, 그리고 국민 여러분과 함께 깨끗하고 공정한 에너지전환을 추진하겠습니다.
            </p>
            <p>투명하고 책임 있는 경영으로 신뢰받는 기관이 되겠습니다. 여러분의 많은 관심과 응원을 부탁드립니다. 감사합니다.</p>
          </div>
          <p className={styles.sign}>
            에너지전환진흥원장 <strong>한지윤</strong>
          </p>
        </div>
      </div>

      <Survey dept="경영기획실" />
    </>
  );
}
