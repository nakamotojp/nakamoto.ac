import { defineCollection, z } from 'astro:content';
// import fs from 'node:fs';
// import path from 'node:path';

// // ==== 追加 (A) 外部サービスで画像生成 =========================
// // 例: https://dummyimage.com/600x400/000/fff&text=Your%20Title
// function buildPlaceholderUrl(title: string): string {
//   const encoded = encodeURIComponent(title);
//   // サイズ・背景・文字色は好きに変えて OK
//   return `https://dummyimage.com/600x400/000/fff&text=${encoded}`;
// }


// // ==== 追加 (B) ローカルで画像生成 (node‑canvas) =============
// // 1. 事前に `npm i -D canvas` をインストール
// // 2. 以下の関数はビルド時に PNG を作成し、public/img/generated に保存
// //    (既に同名ファイルがあれば再利用)
// async function generateTitleImage(title: string): Promise<string> {
//   const canvasPkg = await import('canvas'); // 動的インポートで不要な依存を回避
//   const { createCanvas, loadImage } = canvasPkg;
//   const width = 600;
//   const height = 400;
//   const canvas = createCanvas(width, height);
//   const ctx = canvas.getContext('2d');
//   // 背景
//   ctx.fillStyle = '#000';
//   ctx.fillRect(0, 0, width, height);
//   // テキスト設定
//   ctx.fillStyle = '#fff';
//   ctx.font = 'bold 40px sans-serif';
//   ctx.textAlign = 'center';
//   ctx.textBaseline = 'middle';
//   ctx.fillText(title, width / 2, height / 2);
//   // 出力先パス (public/img/generated/…)
//   const safeName = title
//     .replace(/[^\w\-]/g, '_')      // 記号は _ に置換
//     .replace(/_+/g, '_')
//     .replace(/^_+|_+$/g, '');
//   const fileName = `${safeName || 'title'}.png`;
//   const outDir = path.resolve('public', 'img', 'generated');
//   const outPath = path.join(outDir, fileName);
//   // ディレクトリが無ければ作成
//   await fs.promises.mkdir(outDir, { recursive: true });
//   // 既にファイルがあれば再利用 (ビルドが速くなる)
//   if (!fs.existsSync(outPath)) {
//     await fs.promises.writeFile(outPath, canvas.toBuffer('image/png'));
//   }
//   // `public/` 以下はそのまま `/img/generated/...` で参照できる
//   return `/img/generated/${fileName}`;
// }

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
   *   - `image` が無い && `url` がある → OGP 画像 (既存ロジック)
   *   - `image` が無い && `url` が無い → タイトル文字列からプレースホルダー画像を作成
   */
  async transform(entry) {
    // ① 既に image が設定されていれば何もしない
    if (entry.data.image) return entry;
    // ② url があるときは従来通り OGP 用画像を自動付与
    if (entry.data.url) {
      entry.data.image = `${entry.data.url.replace(/\/$/, '')}/ogp.jpg`;
      return entry;
    }
    // ③ ここまで来たら「image も url も未設定」＝タイトルだけが残っているケース
    const title = entry.data.title ?? 'Untitled';
    // ---- どちらの実装を使うか選択 ----
    // ① 外部サービスで画像URLを生成（軽量・依存なし）
    // entry.data.image = buildPlaceholderUrl(title);
    // ② ローカルで画像ファイルを生成したい場合は下行のコメントを外す
    // entry.data.image = await generateTitleImage(title);
    // --------------------------------
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