import { defineCollection, z } from 'astro:content';

export const CATEGORIES = [
  'メディア',
  'コンテスト',
  '起業',
  'その他',
] as const;

export type Category = (typeof CATEGORIES)[number];

/* --------------------------------------------------------------
   reports コレクション
   - image が無い場合の自動補完は src/utils/reportImage.ts で
     ページ側から呼び出す (defineCollection の `type: 'content'` は
     transform フックをサポートしないため)
-------------------------------------------------------------- */
const reportsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    personId: z.string(),
    category: z.enum(CATEGORIES),
    url: z.string().url().optional().or(z.literal('')),
    description: z.string().optional(),
    image: z.string().optional(),
  }),
});

/* --------------------------------------------------------------
   persons コレクション（変更なし）
-------------------------------------------------------------- */
const personsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    nameEn: z.string().optional(),
    role: z.string().optional(),
    bio: z.string().optional(),
    avatar: z.string().optional(),
    website: z.string().url().optional(),
    order: z.number().optional().default(99),
  }),
});

export const collections = {
  reports: reportsCollection,
  persons: personsCollection,
};
