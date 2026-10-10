# The site

**Status:** Built; live at qdeco.com. **Open work:** B-5, B-8, B-9.

What qdeco.com is made of and how it is published. This was the "What
the site is" section of `spec/status.md`, moved here word for word on
2026-10-09.

- **qdeco.com** is published from `main` of **JasonHunt3r/Qdeco** (public), with
  `CNAME`. How, and which files it leaves out: `spec/publishing.md`. A push to
  `main` is a publish (live in ~1 minute). Plain static HTML, no build step.
- `index.html` — the one page ("On the Margins", title "Qdeco Presenter Demo"):
  the IO-marker demo, sections Qdeco / RhythmIO / BGTools / UP Scaler / About /
  Support, Settings (Calm, Desktop, resets). Icons inline as WebP data URLs.
- `privacy.html` (no edit mode, by Jason's choice 2026-10-09: it changes rarely
  and is edited by hand); `html2canvas.min.js` (self-hosted, no Cloudflare
  request); the three app icon PNGs; `edit.js` (edit mode, `spec/edit-in-place.md`).
- Retired pages are kept in the repo and not published:
  `index-retired-2026-10-09.html`, `index-retired-2026-10-09b.html`.

**Where the page's pictures come from** (Confirmed 2026-10-09, decoded):
- The three icon PNGs (`rhythmio-icon.png`, `bgtools-icon.png`,
  `upscaler-icon.png`, 1024×1024) are the **masters**. They stay published as
  the site's picture resources, but `index.html` does not load them.
- `index.html` carries its own **inline WebP copies**: six `img[data-e]`, three
  pictures each used twice (Qdeco section and the app's own section), 160×160,
  5–6.5 KB each, the same artwork as the masters.
- So a new master does not change the page. The page's copy is replaced in
  edit mode's picture picker, which redraws it at the spot's width. Nothing
  says when a copy has fallen behind its master (B-8).

**Jason's local files** (git-excluded, never commit): `Design Jam For Qdeco
Website Description/`, `On The Margins web index/` (page drafts),
`Qdeco history Jason's words.md`, `index-local-2026-10-07.html`, `Drop Offs/`
(his inbox: look there first; move each file where it belongs).
