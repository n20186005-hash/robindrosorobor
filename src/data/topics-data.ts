// ৩৯টি বাংলা বিষয়ের ডেটা রেজিস্ট্রি। গ্রুপভিত্তিক ফাইলগুলো একত্র করে TOPICS তৈরি করা হয়েছে।
// E-E-A-T নীতি: কোনো নির্দিষ্ট দোকান/রেস্তোরাঁ/পরিবহন অপারেটর সুপারিশ করা হয়নি;
// যাচাই না-করা সময়/মূল্য/টিকিট এড়িয়ে নিরপেক্ষ সতর্কতা দেওয়া হয়েছে।

import { visitTopics } from './topics-visit';
import { transportTopics } from './topics-transport';
import { lakeTopics } from './topics-lake';
import { foodTopics } from './topics-food';
import { nearbyTopics } from './topics-nearby';
import { routeTopics } from './topics-routes';
import type { Topic } from './topics';

export const TOPICS: Topic[] = [
  ...visitTopics,
  ...transportTopics,
  ...lakeTopics,
  ...foodTopics,
  ...nearbyTopics,
  ...routeTopics,
];
