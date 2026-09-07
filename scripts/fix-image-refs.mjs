#!/usr/bin/env node
// Rewrites /img/... references in src/content frontmatter/body so their
// Unicode form matches the actual tracked filename in git (NFC).
//
// Why this exists: macOS resolves NFD and NFC filenames as the same file
// locally, but Linux CI (GitHub Actions) does not. A frontmatter path typed
// in NFD that points to an NFC-named file builds fine on a Mac but 404s once
// deployed via GitHub Actions. Run this after adding/editing image
// references (especially ones with Japanese filenames) to make them match.
//
// Usage: node scripts/fix-image-refs.mjs [--dry-run]

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, globSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const dryRun = process.argv.includes("--dry-run");

function gitTrackedImgFiles() {
  // core.quotepath=false + -z: raw UTF-8 paths, NUL-separated, no octal escaping
  const out = execSync(
    "git -c core.quotepath=false ls-files -z -- img public/img",
    { cwd: repoRoot, encoding: "utf8" }
  );
  const map = new Map(); // NFC decoded "/img/name.ext" -> canonical decoded "/img/name.ext"
  for (const line of out.split("\0").filter(Boolean)) {
    const base = line.replace(/^(img|public\/img)\//, "");
    const decodedKey = `/img/${base}`.normalize("NFC");
    if (!map.has(decodedKey)) {
      map.set(decodedKey, `/img/${base}`); // canonical = as tracked by git
    }
  }
  return map;
}

const canonical = gitTrackedImgFiles();
const contentFiles = globSync("src/content/**/*.{md,mdx}", { cwd: repoRoot });

let changedFiles = 0;
let changedRefs = 0;

for (const relFile of contentFiles) {
  const filePath = path.join(repoRoot, relFile);
  let content = readFileSync(filePath, "utf8");
  let fileChanged = false;

  const refs = [...content.matchAll(/\/img\/[^"'()\s]+/g)].map((m) => m[0]);

  for (const ref of refs) {
    const decoded = decodeURIComponent(ref);
    const nfcKey = decoded.normalize("NFC");
    const canonicalRef = canonical.get(nfcKey);

    if (!canonicalRef) {
      console.warn(`  ! ${relFile}: no tracked file for ${ref} (skipped)`);
      continue;
    }

    if (canonicalRef !== ref) {
      content = content.split(ref).join(canonicalRef);
      fileChanged = true;
      changedRefs++;
      console.log(`  ${relFile}: ${ref} -> ${canonicalRef}`);
    }
  }

  if (fileChanged) {
    changedFiles++;
    if (!dryRun) {
      writeFileSync(filePath, content, "utf8");
    }
  }
}

console.log(
  `\n${dryRun ? "[dry-run] " : ""}Done: ${changedRefs} reference(s) fixed in ${changedFiles} file(s).`
);
