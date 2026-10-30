// 39টি স্বাধীন বাংলা SEO বিষয়ের ইন্টারফেস, গ্রুপ লেবেল ও সহায়ক ফাংশন।
// প্রকৃত তথ্য ও স্বাধীন-তৃতীয়পক্ষীয় নীতি (E-E-A-T) মেনে চলা হয়েছে: কোনো নির্দিষ্ট দোকান/রেস্তোরাঁ সুপারিশ করা হয়নি।

import { TOPICS } from './topics-data';
import { seo } from './site';

export type TopicGroup = 'visit' | 'transport' | 'lake' | 'food' | 'nearby' | 'routes';

export interface TopicSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  note?: string; // নিরপেক্ষ সতর্কতা / সীমাবদ্ধতা বক্স
  noteTitle?: string;
}

export interface TopicFaq {
  q: string;
  a: string;
}

export interface Topic {
  slug: string; // যেমন 'visit/location' বা 'dhanmondi-lake'
  group: TopicGroup;
  kicker: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  lead: string;
  updated: string;
  sections: TopicSection[];
  faqs: TopicFaq[];
  related: string[]; // অন্য বিষয়ের slug
}

export const GROUP_LABELS: Record<TopicGroup, string> = {
  visit: 'পরিদর্শন ও সিদ্ধান্ত',
  transport: 'যাতায়াত ও প্রবেশ',
  lake: 'ধানমন্ডি লেক',
  food: 'আশপাশের খাবার',
  nearby: 'আশপাশের দর্শনীয় স্থান',
  routes: 'ভ্রমণ পথ ও রূপরেখা',
};

export const GROUP_ORDER: TopicGroup[] = ['visit', 'transport', 'lake', 'food', 'nearby', 'routes'];

export const AS_OF = '৩০ অক্টোবর ২০২৬';

export { TOPICS };

export function topicSlugs(): string[] {
  return TOPICS.map((t) => t.slug);
}

export function getTopic(slug: string | undefined): Topic | undefined {
  if (!slug) return undefined;
  return TOPICS.find((t) => t.slug === slug);
}

export function getTopicTitle(slug: string): string {
  return getTopic(slug)?.h1 ?? '';
}

export function topicPath(slug: string): string {
  return `/${slug}/`;
}

export function topicsByGroup(group: TopicGroup): Topic[] {
  return TOPICS.filter((t) => t.group === group);
}

export function topicGroupLabel(group: TopicGroup): string {
  return GROUP_LABELS[group];
}

// ওয়েবসাইটের মূল ডোমেইন (canonical/OG/JSON-LD-এর ভিত্তি)
export const SITE_BASE = seo.siteUrl;
