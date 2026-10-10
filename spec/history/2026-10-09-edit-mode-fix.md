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

## Later the same evening: the first real Save

After the fix was pushed (`89a64a4`), App Claude checked the live site
in the Claude app's browser: edit mode opens and closes, and the
working docs return "not found". Jason then found he had been pressing
⌘⌥E, not ⌃⌥E; with the right keys it worked in Safari. He made a
fine-grained token (Qdeco only, Contents: Read and write, 90 days) and
saved an edit.

**The Save worked** (Confirmed): commit `b5da507`, "Edit in place: 1
text (m-bgtools.p1)", one line changed, published by the workflow
within a minute. That closes B-2, whose entry read: "Jason tries edit
mode in Safari and makes a first real Save. His first try found it did
not start; the fix is checked in Chromium only and needs pushing
first."

**But the page told him it had not saved.** His words: "Clicked save.
Then done, says it didn't save." Likely cause (Conjecture, from the
code; his screen was not seen): Done was clicked while the Save was
still in flight. Until GitHub answers, the edit still counts as
unsaved, so leaving asked "1 change not saved. Leave edit mode and
lose them?" and, on OK, put the old text back on screen while the
commit went through anyway.

**Fixed:** while a Save is in flight, Done is disabled and ⌃⌥E answers
"Still saving. One moment."; a finished Save shows a note, "Saved. The
site updates in about a minute.", and a failed one a red note.
Checked in headless Chromium with a Save slowed to 2.5 seconds: leaving
is refused during it, no dialog appears, and the edited text stays.
