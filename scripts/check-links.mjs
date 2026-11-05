import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlFiles = [];
const errors = [];

async function collectHtml(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) await collectHtml(fullPath);
    else if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(fullPath);
  }
}

function getAttribute(tag, name) {
  const expression = new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i");
  const match = tag.match(expression);
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null;
}

function reportMissing(source, target, reference) {
  errors.push(`${path.relative(root, source)} -> ${reference} (not found: ${path.relative(root, target)})`);
}

async function checkReference(source, reference, ids) {
  if (!reference || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)) return;
  const url = new URL(reference, `https://local.invalid/${path.relative(root, source).replaceAll("\\", "/")}`);
  const pathname = decodeURIComponent(url.pathname);
  const target = pathname === "/" ? root : path.resolve(root, `.${pathname}`);
  if (!target.startsWith(root + path.sep) && target !== root) return;

  let targetPath = target;
  if (reference.startsWith("#")) targetPath = source;
  else if (!path.extname(targetPath)) {
    try {
      const entries = await readdir(targetPath);
      if (entries.includes("index.html")) targetPath = path.join(targetPath, "index.html");
    } catch {
      reportMissing(source, targetPath, reference);
      return;
    }
  }

  try {
    await readFile(targetPath);
  } catch {
    reportMissing(source, targetPath, reference);
    return;
  }

  if (url.hash && targetPath.endsWith(".html")) {
    const targetIds = targetPath === source ? ids : await getIds(targetPath);
    const fragment = decodeURIComponent(url.hash.slice(1));
    if (!targetIds.has(fragment)) errors.push(`${path.relative(root, source)} -> ${reference} (missing fragment #${fragment})`);
  }
}

const idCache = new Map();
async function getIds(file) {
  if (idCache.has(file)) return idCache.get(file);
  const html = await readFile(file, "utf8");
  const ids = new Set([...html.matchAll(/\b(?:id|name)\s*=\s*["']([^"']+)["']/gi)].map(match => match[1]));
  idCache.set(file, ids);
  return ids;
}

await collectHtml(root);
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const ids = await getIds(file);
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "");
  const tags = markup.match(/<(?:a|area|link|script|img|source|iframe|video|audio|form)\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    for (const attribute of ["href", "src", "poster", "action"]) {
      const reference = getAttribute(tag, attribute);
      if (reference) await checkReference(file, reference, ids);
    }
  }
}

if (errors.length) {
  console.error("Local link validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Checked local links and fragments in ${htmlFiles.length} HTML files.`);
}
