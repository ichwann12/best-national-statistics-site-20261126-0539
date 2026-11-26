// NusaStat hand-in program (Node 22, standard library only).
//
// What it does, in plain terms: it gathers the finished site — the app/
// folder with every page, chart and number, plus the screenshots/ folder —
// copies both into the output directory, and writes dossier.json there.
// The dossier is built by the vendored make.fun library (vendor/), which
// the scorer runs again on its own copy and compares byte for byte, so
// this program never edits the library file itself.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// Caps from the scorer: at most 4 screenshots, each at most 256 KiB; app/ at most
// 993 files and directories and 16 MiB; dossier text at most 160 KiB.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

// Sanity check before finishing: the hand-in is useless if the dossier did
// not actually land, so confirm it exists and is not empty, then print a
// one-line summary of what was copied for the log.
{
  const dossierPath = join(out, 'dossier.json');
  const dossier = readFileSync(dossierPath);
  if (dossier.length === 0) throw new Error('dossier.json was written empty');
  const shots = existsSync(join(out, 'screenshots'))
    ? readdirSync(join(out, 'screenshots')).length
    : 0;
  console.log(
    `NusaStat hand-in ready: app/ + ${shots} screenshot(s) + dossier.json (${dossier.length} bytes) in ${out}`,
  );
}
