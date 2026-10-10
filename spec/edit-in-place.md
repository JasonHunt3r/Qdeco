# Edit in place

**Status:** Built 2026-10-09 (`4041588`). **Open work:** B-2, B-3.

Editing qdeco.com from the page itself. This was the "Edit in place"
section of `spec/status.md`, moved here word for word on 2026-10-09.

- **⌃⌥E** on qdeco.com loads `edit.js` (visitors never download it otherwise)
  and toggles edit mode; **Done** leaves (warns about unsaved changes).
- **Text**: every element with a `data-e="<section>.<tag><n>"` key is editable
  (32 of them: headlines, eyebrows, descriptions, ledes, hint, ladder line,
  links, About/Support text, the footer). Enter is blocked; paste is plain
  text. The "What's so great about this?" buttons are *not* editable: the
  page's script rewrites their labels.
- **Pictures**: click an `img[data-e]`, pick a file; redrawn at the spot's
  width as inline WebP (0.9).
- **Look**: Max width (`MAXW`, the ruler's widest, was a hard-coded 1200) and
  the content padding (`--padL` / `--padR`, CSS fallbacks 96 / 110 px), live.
  **Make my layout the default** writes `DEF` (reading range), `DEFH`
  (header), `MAXW`, the padding fallbacks and `let desk=` (background) into
  the source.
- **Save**: fetches `index.html` from the GitHub Contents API, replaces only
  the edited elements (by `data-e` key; never the live DOM), PUTs it to
  `main` with Jason's **fine-grained token** (repo Qdeco only, Contents read
  and write), kept in `localStorage` (`qdeco.edit.token`) in his browser
  only. A 409/422 means the file changed since load: reload and redo.
- **The contract**: keep the `data-e` keys when editing `index.html` by hand
  (new editable elements need a new unique key); keep `const DEF=[…],
  DEFH=[…];`, `let MAXW=…;`, `var(--padR,…px) 64px var(--padL,…px)` and
  `let desk='…'` in those shapes, or Make-default can't find them.
- **Checked**: the source surgery in Node on the real file (only the intended
  spots change); the live site serves it. **Not yet**: edit mode in a real
  browser, and a first real Save (Jason, 2026-10-09: "push it and i'll try
  it live").
