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
   - 既存スキーマはそのまま維持
   - transform フックで image が無い場合に url から OGP 画像を自動設定
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

  /**
   * transform:
   *   * `entry` はコンテンツエントリ（front‑matter データ）です。
   *   * `image` が未定義か空文字の場合、`url` が存在すれば
   *     その URL の末尾に `/ogp.jpg`（もしくは任意のパス）を付けた
   *     文字列を `image` に代入します。
   *   * ここで生成した文字列はそのままフロントマターに保存され、
   *     コンポーネント側で `post.data.image` として取得できます。
   */
  async transform(entry) {
    // `image` が空で、かつ `url` が設定されている場合に自動補完
    if (!entry.data.image && entry.data.url) {
      // OGP 画像の規則はプロジェクトに合わせて変更してください。
      // 例: https://example.com/ => https://example.com/ogp.jpg
      entry.data.image = `${entry.data.url.replace(/\/$/, '')}/ogp.jpg`;
    }
    return entry;
  },
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