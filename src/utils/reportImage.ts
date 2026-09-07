import type { CollectionEntry } from 'astro:content';
import { captureScreenshot } from './screenshot';

// url ごとに一度だけ取得すれば十分なので、ビルド内でメモ化する
const ogImageCache = new Map<string, Promise<string | undefined>>();

async function fetchOgImage(url: string): Promise<string | undefined> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NakamotoAcBot/1.0; +https://nakamoto.ac)',
      },
    });
    clearTimeout(timeout);
    if (!res.ok) return undefined;

    const html = await res.text();
    const match =
      html.match(/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
    if (!match) return undefined;

    return new URL(match[1], url).toString();
  } catch {
    return undefined;
  }
}

function resolveOgImage(url: string): Promise<string | undefined> {
  let cached = ogImageCache.get(url);
  if (!cached) {
    cached = fetchOgImage(url);
    ogImageCache.set(url, cached);
  }
  return cached;
}

/**
 * report の frontmatter に image が無い場合、以下の順で補完する:
 *   1. url 先ページの og:image (無ければ twitter:image)
 *   2. どちらも取得できない場合、url のファーストビューをスクリーンショット
 *   3. スクリーンショットも失敗した場合、`${url}/ogp.jpg` を推測値として補完
 */
export async function resolveReportImage<T extends CollectionEntry<'reports'>>(
  report: T
): Promise<T> {
  if (report.data.image || !report.data.url) return report;

  const ogImage = await resolveOgImage(report.data.url);
  const screenshot = ogImage ? undefined : await captureScreenshot(report.data.url);
  const image = ogImage ?? screenshot ?? `${report.data.url.replace(/\/$/, '')}/ogp.jpg`;

  return { ...report, data: { ...report.data, image } };
}

export async function resolveReportImages<T extends CollectionEntry<'reports'>>(
  reports: T[]
): Promise<T[]> {
  return Promise.all(reports.map(resolveReportImage));
}
