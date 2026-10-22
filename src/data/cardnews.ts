import raw from './json/cardnews.json';
import type { CardnewsItem } from './types';

// JSON 의 type 필드는 string 으로 추론되므로 슬라이드 유니온 타입으로 단언한다
export const cardnews = raw as unknown as CardnewsItem[];
