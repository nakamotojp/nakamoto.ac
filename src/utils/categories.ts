import type { Category } from '../content/config';

export interface CategoryMeta {
  name: Category;
  slug: string;
  badgeClass: string;
  badgeActiveBg: string;
  icon: string;
  description: string;
}

export const CATEGORY_META_LIST: CategoryMeta[] = [
  {
    name: '新聞雑誌',
    slug: 'press',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    badgeActiveBg: 'bg-blue-600 text-white border-blue-600',
    icon: '📰',
    description: '新聞、雑誌、WEBメディア等の記事・インタビュー掲載実績',
  },
  {
    name: '動画',
    slug: 'video',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
    badgeActiveBg: 'bg-rose-600 text-white border-rose-600',
    icon: '📺',
    description: 'テレビ番組、YouTube、ドキュメンタリー、配信動画等の出演実績',
  },
  {
    name: 'コンテスト',
    slug: 'contest',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
    badgeActiveBg: 'bg-amber-600 text-white border-amber-600',
    icon: '🏆',
    description: 'ピッチコンテスト、大会、甲子園等の受賞・登壇実績',
  },
  {
    name: '起業',
    slug: 'startup',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
    badgeActiveBg: 'bg-emerald-600 text-white border-emerald-600',
    icon: '🚀',
    description: '会社設立、新事業・新プロダクト立ち上げ、出資・事業展開',
  },
  {
    name: 'その他',
    slug: 'other',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
    badgeActiveBg: 'bg-slate-700 text-white border-slate-700',
    icon: '📌',
    description: '委員就任、表敬訪問、イベント登壇、各種活動報告',
  },
];

export const CATEGORY_MAP = new Map<string, CategoryMeta>();
CATEGORY_META_LIST.forEach((meta) => {
  CATEGORY_MAP.set(meta.name, meta);
  CATEGORY_MAP.set(meta.slug, meta);
});

export function getCategoryMeta(categoryOrSlug: string): CategoryMeta {
  const found = CATEGORY_MAP.get(categoryOrSlug);
  if (found) return found;
  return {
    name: 'その他',
    slug: 'other',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
    badgeActiveBg: 'bg-slate-700 text-white border-slate-700',
    icon: '📌',
    description: '活動報告',
  };
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

