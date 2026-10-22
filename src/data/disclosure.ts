import raw from './json/disclosure.json';
import rawCategories from './json/disclosureCategories.json';
import type { DisclosureItem, DisclosureCategory } from './types';

export const disclosure = raw as DisclosureItem[];
export const disclosureCategories = rawCategories as DisclosureCategory[];
