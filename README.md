# nakamoto.ac 報道歴・活動実績ポートフォリオ

[nakamoto.ac](https://nakamoto.ac/) の活動報告・報道歴アーカイブサイトです。  
Astro + TypeScript + Tailwind CSS で構築されており、GitHub上でMarkdownファイルを追加・編集するだけで自動集約・整理されて公開されます。

---

## 運用方法（実績・報道の追加手順）

### 1. 新しい報道・実績を追加する
`src/content/reports/` 配下に新しいMarkdownファイル（例: `2026-10-01-press-release.md`）を作成し、Front Matterを記述します。

```markdown
---
title: "報道・実績のタイトル"
date: 2026-10-01
personId: "satoshi-nakamoto"
category: "新聞雑誌"
url: "https://example.com/article"
description: "記事の要約や概要テキストを記述します（省略可能）"
---

本文には補足情報や詳細な記録を記述できます（省略可能）。
```

#### カテゴリ指定（5種）
以下のいずれかを必ず指定してください:
- `新聞雑誌`
- `動画`
- `メディア`
- `コンテスト`
- `起業`
- `その他`

#### 人物ID (`personId`)
`src/content/persons/` のファイル名（拡張子 `.md` 除く）と紐づきます:
- `satoshi-nakamoto` 
- `ryosuke-nakamoto` 
- `kengo-nakamoto` 

---

### 2. 人物プロフィールを編集・追加する
`src/content/persons/` 配下のMarkdownファイルを編集します。

```markdown
---
name: "中本 慧思"
nameEn: "SATOSHI NAKAMOTO"
role: "起業家 / エンジニア"
bio: "プロフィール概要"
website: "https://sato4.jp/"
order: 1
---

自己紹介や詳細プロフィール。
```

---

### 3. アイキャッチ画像 (`image`) の自動補完

`image` を指定しなかった場合、`url` を元に以下の優先順で自動補完されます（`src/utils/reportImage.ts` / `src/utils/screenshot.ts`）:

1. `url` 先ページの `og:image`（無ければ `twitter:image`）
2. どちらも取得できない場合、`url` のファーストビュー（ビューポート内）をPlaywrightでスクリーンショットし、`img/screenshots/` に保存して使用
3. スクリーンショットにも失敗した場合、`${url}/ogp.jpg` を推測値として使用（最終フォールバック）

スクリーンショットを実際に生成するには、ローカルで一度だけ以下を実行してください（未実行でもビルドは失敗せず、フォールバック3が使われるだけです）。

```bash
npx playwright install --with-deps chromium
```

生成されたスクリーンショットは `img/screenshots/`（`public/img/screenshots/` にも同期）に保存されます。**同じURLは既存ファイルがあれば再撮影されないため、新しい報道・実績を追加してローカルで一度 `npm run build` を実行したら、生成された画像ファイルも他の変更と一緒にコミットしてください。** GitHub Actions側は既存のスクリーンショットを再利用するだけで、新規に生成した画像をリポジトリへコミットし返すことはしません。

---

## 自動デプロイ (GitHub Pages)

`main` ブランチにプッシュ（またはマージ）されると、`.github/workflows/deploy.yml` により自動でビルドが行われ、GitHub Pages（カスタムドメイン `https://nakamoto.ac/`）に自動反映されます。

---

## ローカル開発手順

```bash
# 依存関係のインストール
npm install

# ローカル開発サーバー起動 (http://localhost:4321)
npm run dev

# 型チェック
npm run check

# 静的ビルド (dist/ への出力)
npm run build

# ビルド成果物のプレビュー
npm run preview
```
