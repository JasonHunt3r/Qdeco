# 2026-10-09: edit mode did not start; fixed

Jason tried edit in place on the live site for the first time (B-2):
"there's nothing to tell me visually that I've entered edit in place
mode, and right now, it doesn't seem to be working. And it also
doesn't let me know when I'm out of edit in place."

## The cause (Confirmed)

`index.html`'s script runs inside a closure, `(()=>{ … })()`.
`edit.js` is a separate file and used the page's own names as if they
were global: `reduce`, `idleLoop`, `idleTimer`, `MAXW`, `layout`,
`marg`, `tL`, `tR`, `desk`, `sysReduce`, `calm`, `wake`. Reproduced by
App Claude on a copy of the two files in headless Chromium: ⌃⌥E
loaded `edit.js`, added the `qedit` class, then stopped with
"idleLoop is not defined" before any text became editable and before
the bar was made. A second ⌃⌥E failed on the missing bar. So the only
sign was a faint dashed outline, and nothing could be edited.

It was never caught because the build was checked in Node (the source
surgery) and not in a browser.

## The fix

- `index.html`: a `window.QPage` block at the end of the closure hands
  `edit.js` what it needs, and the loader says so if `edit.js` fails
  to load.
- `edit.js`: uses `QPage`; opening is wrapped so a failure puts the
  page back and shows a red note; a frame and notes say when edit mode
  is on and off (`spec/edit-in-place.md`).

## Checked

Headless Chromium, the fixed files served locally, GitHub's API
stubbed: ⌃⌥E opens (frame, note, bar, 34 editable elements); a text
edit and "Make my layout the default" with Max width 1100, then Save,
change exactly three places in the source (the text, the defaults
comment, `let MAXW`); ⌃⌥E closes and the note clears. No page errors.

**Not checked:** Safari, and a real Save with Jason's token. B-2 stays
open for those.
