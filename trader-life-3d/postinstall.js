// Runs as a postinstall hook. Guarantees a chrome-headless-shell binary exists
// at a path the render workflow already probes, so the workflow never has to
// install Chrome itself (that step is fragile across puppeteer versions).
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = __dirname;
const CANDIDATES = [
  path.join(os.homedir(), '.cache', 'remotion', 'chrome-headless-shell'),
  path.join(os.homedir(), 'Library', 'Caches', 'remotion', 'chrome-headless-shell'),
];

function isExec(p) {
  try { fs.accessSync(p, fs.constants.X_OK); return fs.statSync(p).isFile(); }
  catch { return false; }
}

// Already satisfied?
for (const c of CANDIDATES) {
  if (isExec(c)) { console.log('[chrome] already present:', c); process.exit(0); }
}

// Look for one we downloaded on a previous run.
function findLocal() {
  const roots = [path.join(ROOT, '.chrome'), path.join(ROOT, 'node_modules', '.remotion')];
  for (const r of roots) {
    if (!fs.existsSync(r)) continue;
    const stack = [r];
    while (stack.length) {
      const d = stack.pop();
      let entries = [];
      try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch { continue; }
      for (const e of entries) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) stack.push(p);
        else if (e.name === 'chrome-headless-shell' && isExec(p)) return p;
      }
    }
  }
  return null;
}

let bin = findLocal();
if (!bin) {
  console.log('[chrome] downloading chrome-headless-shell@latest ...');
  try {
    execSync('npx --yes @puppeteer/browsers install chrome-headless-shell@latest --path .chrome',
             { cwd: ROOT, stdio: 'inherit' });
  } catch (e) {
    console.log('[chrome] install command failed, will keep looking:', e.message);
  }
  bin = findLocal();
}

if (!bin) {
  console.log('[chrome] WARNING: could not obtain chrome-headless-shell. Render will fail.');
  process.exit(0);   // never break the npm install step
}

// Publish it where the workflow looks first.
const target = CANDIDATES[0];
fs.mkdirSync(path.dirname(target), { recursive: true });
try {
  if (fs.existsSync(target)) fs.unlinkSync(target);
  fs.symlinkSync(bin, target);
  console.log('[chrome] linked', target, '->', bin);
} catch (e) {
  console.log('[chrome] symlink failed, copying instead:', e.message);
  fs.copyFileSync(bin, target);
  fs.chmodSync(target, 0o755);
  console.log('[chrome] copied to', target);
}
