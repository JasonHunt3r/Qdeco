# Edit in place

**Status:** Built 2026-10-09 (`4041588`); fixed the same evening after Jason's first try found it did not start (`spec/history/2026-10-09-edit-mode-fix.md`). **Open work:** B-3.

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

## How edit mode shows itself (added 2026-10-09)

Jason's first try: nothing said he was in edit mode, and nothing said
he had left. Now:

- **Going in**: a blue frame around the whole window, the bar along
  the bottom ("Editing"), a dashed outline on everything editable, and
  a note at the top for three seconds: "Edit mode is on. ⌃⌥E or Done
  to leave."
- **Going out**: the frame, bar and outlines go, and a grey note says
  "Edit mode is off."
- **If it cannot start**: a red note says why, and the page is put
  back as it was. It never half-opens.
- **Saving**: while a Save is in flight, Done is disabled and ⌃⌥E
  answers "Still saving. One moment." A finished Save shows "Saved.
  The site updates in about a minute."; a failed one shows a red note
  and the bar says why.

## The page's handles: `window.QPage` (part of the contract)

`edit.js` is a separate file, and `index.html`'s script runs inside a
closure, so `edit.js` cannot see the page's own variables. The page
hands it the few it needs, at the end of that closure:

`QPage.maxw` (read and set), `QPage.head`, `QPage.desk`,
`QPage.layout()`, `QPage.marg()`, `QPage.sizeStage()`, `QPage.pause()`
and `QPage.resume()`.

Keep that block when editing `index.html` by hand. If the page's
script is ever reorganised, these names must still mean the same
things, or edit mode stops with "can't start".
