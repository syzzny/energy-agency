import raw from './json/stats.json';
import type { StatItem } from './types';

export const stats = raw as StatItem[];
