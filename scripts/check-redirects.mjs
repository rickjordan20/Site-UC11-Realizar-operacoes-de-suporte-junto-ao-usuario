import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { redirects = [] } = JSON.parse(await readFile(path.join(root, "vercel.json"), "utf8"));
const errors = [];
const exists = file => access(path.join(root, file)).then(() => true, () => false);
const sources = new Set(redirects.map(rule => rule.source));

for (const { source, destination, permanent } of redirects) {
  if (permanent !== true) errors.push(`${source}: redirect must be permanent (308)`);
  if (source === destination || sources.has(destination)) errors.push(`${source}: redirect loop`);
  if (await exists(source.slice(1))) errors.push(`${source}: source file still exists and would never be served`);
  if (!(await exists(destination.slice(1)))) errors.push(`${source}: destination ${destination} does not exist`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Checked ${redirects.length} permanent redirects in vercel.json.`);
