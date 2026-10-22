import { Icon } from '@/components/Icon';
import styles from './Article.module.scss';

export interface AttachmentFile {
  name: string;
  size: string;
  /** 문서 미리보기(새 창) 버튼 노출 */
  preview?: boolean;
}

/** 첨부파일 목록 — notice/press/recruit/cardnews 상세에서 반복되던 마크업을 공용 컴포넌트로 추출 */
export function AttachmentList({ files }: { files: AttachmentFile[] }) {
  if (!files.length) return null;

  return (
    <section className={styles.attach} aria-labelledby="attachTitle">
      <h4 className={styles.attachTitle} id="attachTitle">
        첨부파일 <em className="num">{files.length}</em>
      </h4>
      <ul className={styles.attachList}>
        {files.map((f) => (
          <li key={f.name} className={styles.attachItem}>
            <p className={styles.attachName}>
              <Icon name="file" />
              <span>{f.name}</span>
              <small>{f.size}</small>
            </p>
            <div className={styles.attachBtns}>
              {f.preview && (
                <a href="#" className={styles.attachBtn} title={`${f.name} 미리보기 (새 창 열림)`} target="_blank" rel="noopener">
                  <Icon name="eye" />
                  미리보기
                </a>
              )}
              <a href="#" className={styles.attachBtn} download>
                <Icon name="download" />
                다운로드
                <span className="sr-only"> {f.name}</span>
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
