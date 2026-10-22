import raw from './json/faq.json';
import rawCategories from './json/faqCategories.json';
import type { FaqItem, FaqCategory } from './types';

export const faq = raw as FaqItem[];
export const faqCategories = rawCategories as FaqCategory[];
