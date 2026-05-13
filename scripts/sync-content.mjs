#!/usr/bin/env node
/**
 * Pulls the latest sot-knowledge .skill bundle from Edward bot on the VPS,
 * extracts it into content/sot-knowledge/, then regenerates the inline manifest.
 *
 * Requires SSH access to root@187.127.98.33.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, existsSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const STAGING = join(ROOT, ".content-staging");
const CONTENT_PARENT = join(ROOT, "content");
const CONTENT_DIR = join(CONTENT_PARENT, "sot-knowledge");

const VPS = "root@187.127.98.33";
const REMOTE_PATH =
  "/docker/openclaw-ji2m/data/.openclaw/workspace/skills/dist/sot-knowledge-latest.skill";

function run(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: "inherit" });
  if (r.status !== 0) {
    console.error(`[sync-content] ${cmd} ${args.join(" ")} exited ${r.status}`);
    process.exit(r.status ?? 1);
  }
}

console.log("[sync-content] pulling latest .skill bundle from Edward bot...");
mkdirSync(STAGING, { recursive: true });
const stagedSkill = join(STAGING, "sot-knowledge-latest.skill");
run("scp", [`${VPS}:${REMOTE_PATH}`, stagedSkill]);

console.log("[sync-content] extracting...");
if (existsSync(CONTENT_DIR)) {
  rmSync(CONTENT_DIR, { recursive: true });
}
mkdirSync(CONTENT_PARENT, { recursive: true });
run("unzip", ["-o", stagedSkill, "-d", CONTENT_PARENT]);

console.log("[sync-content] regenerating manifest...");
run("node", [join(ROOT, "scripts/build-manifest.mjs")]);

console.log("[sync-content] done. Review changes with: git diff content/");
