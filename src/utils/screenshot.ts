import { createHash } from 'node:crypto';
import { access, mkdir, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium, type Browser } from 'playwright';

const SCREENSHOT_DIR_SRC = path.join(process.cwd(), 'img', 'screenshots');
const SCREENSHOT_DIR_PUBLIC = path.join(process.cwd(), 'public', 'img', 'screenshots');

let browserPromise: Promise<Browser> | undefined;
const screenshotCache = new Map<string, Promise<string | undefined>>();

function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = chromium.launch({ headless: true });
  }
  return browserPromise;
}

function hashFor(url: string): string {
  return createHash('sha1').update(url).digest('hex').slice(0, 16);
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function takeScreenshot(url: string): Promise<string | undefined> {
  const filename = `${hashFor(url)}.jpg`;
  const srcPath = path.join(SCREENSHOT_DIR_SRC, filename);
  const publicPath = path.join(SCREENSHOT_DIR_PUBLIC, filename);
  const publicUrl = `/img/screenshots/${filename}`;

  // 既に撮影済みなら再撮影しない
  if (await fileExists(srcPath)) {
    if (!(await fileExists(publicPath))) {
      await mkdir(SCREENSHOT_DIR_PUBLIC, { recursive: true });
      await copyFile(srcPath, publicPath);
    }
    return publicUrl;
  }

  try {
    const browser = await getBrowser();
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    const buffer = await page.screenshot({ type: 'jpeg', quality: 80 });
    await page.close();

    await mkdir(SCREENSHOT_DIR_SRC, { recursive: true });
    await mkdir(SCREENSHOT_DIR_PUBLIC, { recursive: true });
    await writeFile(srcPath, buffer);
    await writeFile(publicPath, buffer);

    return publicUrl;
  } catch {
    return undefined;
  }
}

/**
 * url のファーストビュー(ビューポート内)をスクリーンショットし、
 * img/screenshots/ と public/img/screenshots/ に保存してローカルパスを返す。
 * 既に撮影済みのURLは再撮影せずそのまま返す。失敗時は undefined。
 */
export function captureScreenshot(url: string): Promise<string | undefined> {
  let cached = screenshotCache.get(url);
  if (!cached) {
    cached = takeScreenshot(url);
    screenshotCache.set(url, cached);
  }
  return cached;
}

export async function closeSharedBrowser(): Promise<void> {
  if (browserPromise) {
    const browser = await browserPromise;
    await browser.close();
    browserPromise = undefined;
  }
}
