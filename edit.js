// edit.js: edit qdeco.com in place (Jason, 2026-10-10). index.html loads it
// on ⌃⌥E; visitors never download it otherwise.
//
// Text: every element tagged data-e="…" in index.html becomes editable.
// Pictures: click one, pick a file; it's stored inline as WebP, as the page's
// icons already are. Look: Max width and the content padding, live, and
// "Make my layout the default" (the reading range, the header, the
// background, the max width and padding as they are in this window).
// Save fetches index.html from GitHub, changes only what was edited (found by
// its data-e key, so the page's live state never leaks in), and commits it
// to main with Jason's token: qdeco.com updates in about a minute. The token
// is kept in this browser only; nothing is sent anywhere but GitHub, and
// only on Save.
(() => {
  const REPO = 'JasonHunt3r/Qdeco', FILE = 'index.html', BRANCH = 'main';
  const API = `https://api.github.com/repos/${REPO}`;
  const TOKEN_KEY = 'qdeco.edit.token';
  const P = window.QPage;   // the page's own handles (index.html, "the page's handles for edit mode")

  let on = false, bar = null, unhidden = [], saving = false, leaveAfterSave = false;
  const original = new Map();   // key → innerHTML when edit mode opened
  const texts = new Map();      // key → new innerHTML
  const pictures = new Map();   // key → new data URL
  let look = null;              // the layout snapshot to make the default

  const $ = s => document.querySelector(s);
  const textEls = () => [...document.querySelectorAll('[data-e]')].filter(e => e.tagName !== 'IMG');
  const picEls = () => [...document.querySelectorAll('img[data-e]')];
  const changes = () => texts.size + pictures.size + (look ? 1 : 0);
  const token = () => { try { return localStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; } };

  // ---------- styles ----------
  const css = document.createElement('style');
  css.textContent = `
.qedit [data-e]{outline:1px dashed rgba(110,160,255,.55);outline-offset:3px;border-radius:2px;cursor:text}
.qedit img[data-e]{cursor:pointer}
.qedit [data-e]:focus{outline:2px solid #6aa0ff}
.qedit [data-e].qe-changed{outline:2px solid #f0a64a}
#qe-bar{position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;display:flex;flex-wrap:wrap;align-items:center;gap:10px;
  padding:10px 12px;background:rgba(22,28,40,.97);border:1px solid #3a4558;border-radius:10px;color:#dfe6f2;
  font:13px/1.3 -apple-system,system-ui,sans-serif;box-shadow:0 14px 40px rgba(0,0,0,.5)}
#qe-bar b{color:#fff}
#qe-bar label{display:inline-flex;align-items:center;gap:5px}
#qe-bar input[type=number]{width:62px;background:#0f141d;color:#dfe6f2;border:1px solid #3a4558;border-radius:5px;padding:3px 5px}
#qe-bar input[type=password]{width:240px;background:#0f141d;color:#dfe6f2;border:1px solid #3a4558;border-radius:5px;padding:3px 6px}
#qe-bar button{background:#2b3446;color:#dfe6f2;border:1px solid #46526a;border-radius:6px;padding:4px 10px;font:inherit;cursor:pointer}
#qe-bar button.primary{background:#2f6fe0;border-color:#2f6fe0;color:#fff}
#qe-bar button:disabled{opacity:.45;cursor:default}
#qe-bar .sep{width:1px;align-self:stretch;background:#3a4558}
#qe-status{flex:1 1 200px;color:#aab6ca}
#qe-status a{color:#9cc0ff}
#qe-frame{position:fixed;inset:0;z-index:9998;pointer-events:none;border:3px solid #6aa0ff;box-shadow:inset 0 0 0 1px rgba(10,14,22,.6)}
#qe-toast{position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:10000;padding:10px 18px;border-radius:999px;
  background:#2f6fe0;color:#fff;font:600 14px/1.3 -apple-system,system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.45);
  transition:opacity .4s ease;pointer-events:none}
#qe-toast.off{background:#2b3446}
#qe-toast.bad{background:#b3261e}`;

  // ---------- saying so: a frame while editing, and a word going in and out ----------
  let frame = null, toastEl = null, toastTimer = null;
  function toast(text, kind, ms) {
    if (!css.isConnected) document.head.appendChild(css);
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.id = 'qe-toast'; toastEl.setAttribute('role', 'status'); }
    toastEl.className = kind || ''; toastEl.textContent = text; toastEl.style.opacity = '1';
    if (!toastEl.isConnected) document.body.appendChild(toastEl);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.style.opacity = '0'; toastTimer = setTimeout(() => toastEl.remove(), 450); }, ms || 3000);
  }

  // ---------- the bar ----------
  function makeBar() {
    bar = document.createElement('div');
    bar.id = 'qe-bar';
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', 'Edit qdeco.com');
    bar.innerHTML = `
<b>Editing</b>
<label><input type="checkbox" id="qe-unhide"> Show hidden text</label>
<span class="sep"></span>
<label>Max width <input type="number" id="qe-maxw" min="600" max="2400" step="10"> px</label>
<label>Padding <input type="number" id="qe-padl" min="0" max="300" step="2" aria-label="Left padding"> /
  <input type="number" id="qe-padr" min="0" max="300" step="2" aria-label="Right padding"> px</label>
<button id="qe-look">Make my layout the default</button>
<span class="sep"></span>
<span id="qe-status" role="status"></span>
<span id="qe-tokenbox" hidden><input type="password" id="qe-token" placeholder="Paste your GitHub token" aria-label="GitHub token"> <button id="qe-tokensave">Keep</button></span>
<button id="qe-forget" title="Remove the GitHub token from this browser">Forget token</button>
<button class="primary" id="qe-save">Save</button>
<button id="qe-done">Done</button>`;
    document.body.appendChild(bar);
    const pad = currentPadding();
    $('#qe-maxw').value = P.maxw;
    $('#qe-padl').value = pad.l;
    $('#qe-padr').value = pad.r;
    $('#qe-unhide').addEventListener('change', e => unhide(e.target.checked));
    $('#qe-maxw').addEventListener('input', e => { const v = +e.target.value; if (v >= 600) { P.maxw = v; P.layout(); } });
    $('#qe-padl').addEventListener('input', e => setPad('--padL', e.target.value));
    $('#qe-padr').addEventListener('input', e => setPad('--padR', e.target.value));
    $('#qe-look').addEventListener('click', snapshot);
    $('#qe-save').addEventListener('click', save);
    $('#qe-done').addEventListener('click', () => toggle());
    $('#qe-forget').addEventListener('click', () => { try { localStorage.removeItem(TOKEN_KEY); } catch (e) {} status('The token is gone from this browser.'); });
    $('#qe-tokensave').addEventListener('click', () => {
      const t = $('#qe-token').value.trim(); if (!t) return;
      try { localStorage.setItem(TOKEN_KEY, t); } catch (e) {}
      $('#qe-token').value = ''; $('#qe-tokenbox').hidden = true; save();
    });
    refresh();
  }

  function status(html) { $('#qe-status').innerHTML = html; }
  function refresh() {
    const n = changes();
    $('#qe-save').disabled = n === 0;
    $('#qe-save').textContent = n ? `Save (${n})` : 'Save';
    if (n && !$('#qe-status').dataset.sticky) status(`${n} change${n === 1 ? '' : 's'} not saved yet.`);
  }

  // ---------- the look ----------
  function currentPadding() {
    const root = getComputedStyle(document.documentElement);
    const l = parseInt(root.getPropertyValue('--padL')), r = parseInt(root.getPropertyValue('--padR'));
    const m = [...document.styleSheets].flatMap(s => { try { return [...s.cssRules]; } catch (e) { return []; } })
      .map(r => r.cssText).join('\n').match(/var\(--padR,\s*(\d+)px\)\s+64px\s+var\(--padL,\s*(\d+)px\)/);
    return { l: isNaN(l) ? (m ? +m[2] : 96) : l, r: isNaN(r) ? (m ? +m[1] : 110) : r };
  }
  function setPad(name, v) { document.documentElement.style.setProperty(name, (+v) + 'px'); P.layout(); }
  function snapshot() {
    const [a, b] = P.marg();
    const pad = currentPadding();
    look = { def: [a, b], head: P.head, desk: P.desk, maxw: P.maxw, padL: pad.l, padR: pad.r };
    status('This window\'s layout will be the default when you Save.');
    refresh();
  }

  // ---------- hidden text ----------
  function unhide(show) {
    if (show) {
      unhidden = [...document.querySelectorAll('.more[hidden]')];
      unhidden.forEach(m => { m.hidden = false; });
    } else {
      unhidden.forEach(m => { m.hidden = true; });
      unhidden = [];
    }
    P.sizeStage();
  }

  // ---------- pictures ----------
  const picker = document.createElement('input');
  picker.type = 'file'; picker.accept = 'image/*'; picker.hidden = true;
  let pickFor = null;
  picker.addEventListener('change', async () => {
    const f = picker.files[0], img = pickFor; picker.value = '';
    if (!f || !img) return;
    const bmp = await createImageBitmap(f);
    const w = img.naturalWidth || 160, h = Math.round(w * bmp.height / bmp.width);
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    c.getContext('2d').drawImage(bmp, 0, 0, w, h);
    const url = c.toDataURL('image/webp', 0.9);
    img.src = url;
    pictures.set(img.dataset.e, url);
    img.classList.add('qe-changed');
    refresh();
  });

  // ---------- in and out ----------
  function toggle() {
    if (on) {
      // A Save in flight still counts its changes as unsaved; leaving now would
      // ask to lose them and undo text that is about to be committed. So Done
      // (or ⌃⌥E) mid-Save leaves as soon as the Save lands (B-7).
      if (saving) {
        leaveAfterSave = true;
        $('#qe-done').textContent = 'Leaving after the Save…';
        status('Saving… Edit mode closes as soon as it lands.');
        return;
      }
      if (changes() && !confirm(`${changes()} change${changes() === 1 ? '' : 's'} not saved. Leave edit mode and lose them?`)) return;
      leave();
    } else enter();
  }

  function enter() {
    if (!P) { toast('Edit mode can\u2019t start: this page is older than edit.js. Reload and try again.', 'bad', 6000); return; }
    try { open(); }
    catch (e) {
      // Never half-open: put the page back and say what went wrong.
      try { leave(true); } catch (e2) {}
      toast('Edit mode failed to start: ' + e.message, 'bad', 8000);
    }
  }

  function open() {
    on = true;
    if (!css.isConnected) document.head.appendChild(css);
    if (!picker.isConnected) document.body.appendChild(picker);
    document.documentElement.classList.add('qedit');
    if (!frame) { frame = document.createElement('div'); frame.id = 'qe-frame'; frame.setAttribute('aria-hidden', 'true'); }
    document.body.appendChild(frame);
    // The page plays itself when idle; not while editing.
    P.pause();
    textEls().forEach(el => {
      original.set(el.dataset.e, el.innerHTML);
      el.contentEditable = el.children.length ? 'true' : 'plaintext-only';
      el.spellcheck = true;
    });
    makeBar();
    status('Click any outlined text to edit it; click a picture to replace it.');
    toast('Edit mode is on. \u2303\u2325E or Done to leave.');
  }

  function leave(quiet) {
    on = false;
    document.documentElement.classList.remove('qedit');
    textEls().forEach(el => {
      el.removeAttribute('contenteditable');
      if (texts.has(el.dataset.e)) el.innerHTML = original.get(el.dataset.e);
      el.classList.remove('qe-changed');
    });
    picEls().forEach(el => el.classList.remove('qe-changed'));
    unhide(false);
    texts.clear(); pictures.clear(); look = null; original.clear();
    if (bar) { bar.remove(); bar = null; }
    if (frame) frame.remove();
    if (P) P.resume();
    if (!quiet) toast('Edit mode is off.', 'off', 2500);
  }

  // ---------- events: the page's own keys and clicks stand aside ----------
  addEventListener('keydown', e => {
    if (e.ctrlKey && e.altKey && e.code === 'KeyE') { e.preventDefault(); e.stopPropagation(); toggle(); return; }
    if (!on) return;
    const t = e.target;
    if (t.isContentEditable) {
      if (e.key === 'Enter') e.preventDefault();   // one line stays one line
      e.stopPropagation();
    } else if (bar && bar.contains(t)) e.stopPropagation();
  }, true);

  document.addEventListener('click', e => {
    if (!on) return;
    const el = e.target.closest('[data-e]');
    if (!el || (bar && bar.contains(el))) return;
    e.preventDefault(); e.stopPropagation();
    if (el.tagName === 'IMG') { pickFor = el; picker.click(); }
  }, true);

  document.addEventListener('input', e => {
    if (!on) return;
    const el = e.target.closest && e.target.closest('[data-e]');
    if (!el || el.tagName === 'IMG') return;
    const k = el.dataset.e;
    if (el.innerHTML === original.get(k)) { texts.delete(k); el.classList.remove('qe-changed'); }
    else { texts.set(k, el.innerHTML); el.classList.add('qe-changed'); }
    refresh();
  }, true);

  document.addEventListener('paste', e => {
    if (!on || !e.target.isContentEditable) return;
    e.preventDefault();
    document.execCommand('insertText', false, (e.clipboardData.getData('text/plain') || '').replace(/\s*\n\s*/g, ' '));
  }, true);

  addEventListener('beforeunload', e => { if (on && changes()) { e.preventDefault(); e.returnValue = ''; } });

  // ---------- the source surgery ----------
  function tagAt(src, key) {
    const i = src.indexOf(`data-e="${key}"`);
    if (i < 0) throw new Error(`“${key}” isn't in index.html on GitHub`);
    const start = src.lastIndexOf('<', i), open = src.indexOf('>', i) + 1;
    return { start, open, name: src.slice(start + 1).match(/^\w+/)[0].toLowerCase() };
  }
  function replaceInner(src, key, html) {
    const { open, name } = tagAt(src, key);
    const re = new RegExp(`<(/?)${name}(?=[\\s>/])`, 'gi');
    re.lastIndex = open;
    let depth = 1, m;
    while ((m = re.exec(src))) {
      depth += m[1] ? -1 : 1;
      if (depth === 0) return src.slice(0, open) + html + src.slice(m.index);
    }
    throw new Error(`no end found for “${key}”`);
  }
  function replaceSrc(src, key, url) {
    const { start, open } = tagAt(src, key);
    const tag = src.slice(start, open).replace(/\ssrc="[^"]*"/, ` src="${url}"`);
    return src.slice(0, start) + tag + src.slice(open);
  }
  function applyLook(src, L) {
    const r4 = v => +(+v).toFixed(4);
    const day = new Date().toISOString().slice(0, 10);
    const rep = (s, re, to, what) => { if (!re.test(s)) throw new Error(`can't find ${what} in index.html`); return s.replace(re, to); };
    src = rep(src, /\/\/ The defaults[^\n]*\n(?:\/\/[^\n]*\n)?(?=const DEF=)/,
      `// The defaults: Jason's layout, made the default in edit mode on ${day}.\n`, 'the defaults note');
    src = rep(src, /const DEF=\[[^\]]*\], DEFH=\[[^\]]*\];/,
      `const DEF=[${r4(L.def[0])}, ${r4(L.def[1])}], DEFH=[${r4(L.head[0])}, ${r4(L.head[1])}];`, 'DEF');
    src = rep(src, /let MAXW=\d+;/, `let MAXW=${Math.round(L.maxw)};`, 'MAXW');
    src = rep(src, /var\(--padR,\d+px\) 64px var\(--padL,\d+px\)/,
      `var(--padR,${Math.round(L.padR)}px) 64px var(--padL,${Math.round(L.padL)}px)`, 'the padding');
    src = rep(src, /let desk='[a-z]+'/, `let desk='${L.desk}'`, 'the background');
    return src;
  }

  // ---------- GitHub ----------
  const b64encode = s => {
    const b = new TextEncoder().encode(s); let bin = '';
    for (let i = 0; i < b.length; i += 0x8000) bin += String.fromCharCode(...b.subarray(i, i + 0x8000));
    return btoa(bin);
  };
  const b64decode = s => {
    const bin = atob(s.replace(/\s/g, '')), u = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(u);
  };
  // cache: 'no-store' matters. GitHub lets a browser reuse an answer for 60
  // seconds, and a reused index.html carries the sha from before the last
  // Save, so a second Save inside a minute was refused (409).
  async function gh(path, opts = {}) {
    const r = await fetch(API + path, { cache: 'no-store', ...opts, headers: {
      Authorization: 'Bearer ' + token(), Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28', ...(opts.headers || {}) } });
    if (!r.ok) {
      let why = ''; try { why = (await r.json()).message; } catch (e) {}
      const err = new Error(why || r.statusText); err.status = r.status; throw err;
    }
    return r.json();
  }

  async function save() {
    if (saving || !changes()) return;
    if (!token()) {
      $('#qe-tokenbox').hidden = false; $('#qe-token').focus();
      status('Saving needs your GitHub token (once, kept in this browser). <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">Make one</a>: only the Qdeco repository, Contents: Read and write.');
      $('#qe-status').dataset.sticky = '1';
      return;
    }
    delete $('#qe-status').dataset.sticky;
    $('#qe-save').disabled = true;
    saving = true;
    status('Saving…');
    try {
      const what = [texts.size && `${texts.size} text`, pictures.size && `${pictures.size} picture${pictures.size === 1 ? '' : 's'}`,
        look && 'the default layout'].filter(Boolean).join(', ');
      let res;
      for (let tries = 0; ; tries++) {
        // Always the file as it is on GitHub this second (the stamp makes the
        // address new each time, for a browser that reuses answers anyway).
        const meta = await gh(`/contents/${FILE}?ref=${BRANCH}&_=${Date.now()}`);
        let src = meta.content ? b64decode(meta.content) : b64decode((await gh(`/git/blobs/${meta.sha}`)).content);
        for (const [k, html] of texts) src = replaceInner(src, k, html);
        for (const [k, url] of pictures) src = replaceSrc(src, k, url);
        if (look) src = applyLook(src, look);
        try {
          res = await gh(`/contents/${FILE}`, { method: 'PUT', body: JSON.stringify({
            message: `Edit in place: ${what} (${[...texts.keys(), ...pictures.keys()].join(', ') || 'layout'})`,
            content: b64encode(src), sha: meta.sha, branch: BRANCH }) });
          break;
        } catch (e) {
          // 409: the file moved between the read and the write. The edits are
          // found by key in the fresh file, so one more go is safe.
          if (e.status !== 409 || tries) throw e;
          await new Promise(r => setTimeout(r, 1500));
        }
      }
      // What's saved is the new starting point.
      for (const [k, html] of texts) original.set(k, html);
      texts.clear(); pictures.clear(); look = null;
      document.querySelectorAll('.qe-changed').forEach(el => el.classList.remove('qe-changed'));
      refresh();
      status(`Saved. qdeco.com updates in about a minute. <a href="${res.commit.html_url}" target="_blank" rel="noopener">The commit</a>`);
      toast('Saved. The site updates in about a minute.', '', 4000);
      if (leaveAfterSave) { saving = false; leaveAfterSave = false; leave(true); toast('Saved, and edit mode is off. The site updates in about a minute.', 'off', 4000); }
    } catch (e) {
      // Not saved: stay in edit mode with the edits, whatever Done asked.
      leaveAfterSave = false;
      toast('Not saved. The bar says why.', 'bad', 5000);
      refresh();
      if (e.status === 401 || e.status === 403) status('GitHub refused the token (' + e.message + '). Forget it and paste a new one.');
      else if (e.status === 409 || e.status === 422) status('GitHub refused the Save: index.html there kept changing (' + e.message + '). Nothing was saved. Your edits are still here; wait a moment and press Save again.');
      else status('Not saved: ' + e.message);
    } finally {
      saving = false;
      if (bar) $('#qe-done').textContent = 'Done';
    }
  }

  window.QEdit = { toggle };
})();
