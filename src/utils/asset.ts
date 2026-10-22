/** public/images, public/favicon.svg 등 정적 자산 경로를 base URL 기준으로 변환 */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}

/** 이미지 주소 — WebP (같은 이름의 .jpg 원본은 보관용) */
export function imageUrl(key: string): string {
  return asset(`images/${key}.webp`);
}

/**
 * 사진(photo-*) 반응형 속성 — 화면 폭에 맞는 크기를 브라우저가 고르게 한다
 *  688px(-sm) / 1376px 두 장. 모바일은 작은 쪽을 받아 전송량이 1/3 로 준다.
 */
export function photoProps(key: string, sizes = '100vw') {
  return {
    src: imageUrl(key),
    srcSet: `${imageUrl(`${key}-sm`)} 688w, ${imageUrl(key)} 1376w`,
    sizes,
  };
}

/**
 * 3D 일러스트(3d-*) 반응형 속성 — 카드 안에 작게(약 130~200px) 보이므로 320px 판을 주로 쓴다
 */
export function artProps(key: string, sizes = '(min-width: 768px) and (max-width: 1023px) 250px, 160px') {
  return {
    src: imageUrl(key),
    srcSet: `${imageUrl(`${key}-320`)} 320w, ${imageUrl(key)} 480w`,
    sizes,
  };
}
