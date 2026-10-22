import raw from './json/recruit.json';
import rawStatus from './json/recruitStatus.json';
import type { RecruitItem, RecruitStatus } from './types';

export const recruit = raw as RecruitItem[];
export const recruitStatus = rawStatus as RecruitStatus[];
