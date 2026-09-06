import { defineCollection, z } from 'astro:content';

export const CATEGORIES = [
  '新聞雑誌',
  '動画',
  'コンテスト',
  '起業',
  'その他',
] as const;

export type Category = (typeof CATEGORIES)[number];

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

