import { useParams } from 'react-router-dom';
import { Badge } from '@/components/Badge';
import { ArticleRoot, ArticleHead, AttachmentList, ArticleBody, InfoTable, Kogl, PostNav, ListBtn } from '@/components/Article';
import { NoticeBox } from '@/components/NoticeBox';
import { Survey } from '@/components/Survey';
import { notices } from '@/data/notices';
import { statusVariant } from '@/utils/status';
import { isoDate } from '@/utils/date';

export default function NoticeViewPage() {
  const { id } = useParams();
  const notice = notices.find((n) => n.id === id) ?? notices[0];

  return (
    <>
      {/* 게시글 본문 (원본 .article) — 아래 공공누리·이전/다음글·버튼은 본문 밖 형제 요소 */}
      <ArticleRoot>
        <ArticleHead
          badges={
            <>
              <Badge label={notice.category} variant={statusVariant(notice.category) ?? 'primary'} />
              <Badge label="접수중" variant="green" />
            </>
          }
          title={notice.title}
          meta={[
            { label: '담당부서', value: '재생에너지보급실' },
            { label: '작성일', value: <time dateTime={isoDate(notice.date)} className="num">{notice.date}</time> },
            { label: '조회수', value: <span className="num">{notice.hits}</span> },
          ]}
        />

        <AttachmentList
          files={[
            { name: '[공고문] 2026년 주택 태양광 보급지원사업 참여기업 모집.hwp', size: '248KB', preview: true },
            { name: '[서식] 참여기업 신청서 및 제출서류 목록.pdf', size: '1.2MB', preview: true },
          ]}
        />

        <ArticleBody>
          <p>에너지전환진흥원은 주택 부문 재생에너지 보급 확대를 위해 「2026년 주택 태양광 보급지원사업」에 참여할 시공기업을 다음과 같이 모집합니다. 역량 있는 기업의 많은 참여를 바랍니다.</p>

          <h4>1. 모집 개요</h4>
          <InfoTable
            caption="모집 개요 — 모집기간, 모집대상, 모집규모, 접수방법"
            rows={[
              ['모집기간', '2026. 10. 20.(화) ~ 11. 14.(금) 18:00까지'],
              ['모집대상', '태양광 설비 시공 실적이 있는 전기공사업 등록 기업'],
              ['모집규모', '전국 권역별 총 60개 기업 내외'],
              ['접수방법', '에너지전환진흥원 누리집 > 참여·민원 > 온라인 접수'],
            ]}
          />

          <h4>2. 제출서류</h4>
          <ul>
            <li>참여기업 신청서 1부 (첨부 서식)</li>
            <li>사업자등록증 및 전기공사업 등록증 사본 각 1부</li>
            <li>최근 3년간 태양광 시공 실적 증명서 1부</li>
          </ul>

          <NoticeBox>제출된 서류는 반환하지 않으며, 허위 사실이 확인될 경우 선정이 취소될 수 있습니다.</NoticeBox>
        </ArticleBody>
      </ArticleRoot>

      <Kogl />
      <PostNav
        prev={{ href: '/news/notice/n2', title: '에너지바우처 하반기 신청 기간 연장 안내', date: '2026.10.17' }}
        next={{ href: '/news/notice/n3', title: '2026년 녹색건축 인증 심사위원 공개 모집', date: '2026.10.14' }}
      />
      <ListBtn href="/news/notice" />
      <Survey dept="재생에너지보급실" />
    </>
  );
}
