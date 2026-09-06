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
- `satoshi-nakamoto` (中本 慧思)
- `ryosuke-nakamoto` (中本 怜祐)
- `kengo-nakamoto` (中本 賢吾)

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
