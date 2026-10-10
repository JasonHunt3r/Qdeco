# 2026-10-09: retired pages unpublished, docs caught up, B-6 closed

Work order from App Claude ("Unpublish the retired pages, and the stale
docs"), carried out by Claude Code the same evening. Frozen in
`verbatim/2026-10-09-work-order-retired-pages.md`.

## What was done

- **The retired pages leave the site.** `index-retired-*` added to the
  rsync excludes in `.github/workflows/pages.yml` and to its copy in
  `spec/publishing.md` (`8322937`). Jason: "we can switch fully to our
  latest version." A dry run of the same rsync on a clean checkout
  publishes `CNAME`, `index.html`, `privacy.html`, `edit.js`,
  `html2canvas.min.js` and the three PNGs. The icon PNGs stay: "we need
  them to be there, or rather that there are image resources available
  that are the most current."
- **Where the page's pictures come from**, checked by decoding
  `index.html`: six inline WebP copies, 160×160, 5–6.5 KB, three
  pictures each used twice, the same artwork as the PNG masters (looked
  at side by side); no PNG is referenced. Written into `spec/site.md`;
  B-8 filed for a copy falling behind its master.
- **`spec/site.md`** no longer says Pages serves the whole of `main`
  (it points at `spec/publishing.md`), no longer lists `spec/` among
  Jason's local-only files, and says the retired pages are kept and not
  published.
- **`spec/status.md`** no longer calls the two Save fixes unpushed:
  they went live at `f68bbfa`.
- **B-6 closed.** Jason, in Safari: "the save glitch is fixed." Git
  shows the test: two edit-mode Saves 18 s apart, the second after Done
  and back in (`eb70ff1` 22:08:34, `ad849c7` 22:08:52).
- **B-4 closed.** With the retired pages unpublished, only
  `privacy.html` was left without edit mode. Jason: "close the privacy
  page to edits." It is edited by hand (`spec/site.md`).
- **B-9 filed**: the home page's title ("Qdeco Presenter Demo"), and no
  description, link-preview image or favicon. The wording is Jason's.

## B-7, found the same evening

Jason: after a Save, Done "turns inactive when save is clicked, and
although it is still clickable, it took 2 clicks to work on the second
time, the first bringing the button back to an active looking state."

Reproduced on a local copy with GitHub faked (no commits), in Chromium
and in WebKit (Playwright's build of Safari's engine; real Safari's
remote automation is off). Save, Done, back in, Save, Done:

- With a 0.7 s fake round trip, Done greys during the Save, is fully
  enabled when it ends, and one click leaves. Not reproduced.
- With a 2.5 s round trip and Done clicked mid-Save: the click does
  nothing and nothing is shown, because a disabled button swallows
  clicks. The "Still saving. One moment." note in `toggle()` can only
  be reached by ⌃⌥E. When the Save ends, Done lights up and one click
  leaves.

So the likely story (Conjecture until checked in Safari): a real Save
(two GitHub calls carrying the 105 KB page) takes seconds, the first
click landed during it, and the Save ending is what made Done look
active again. The fix is Jason's to choose; nothing in `edit.js` was
changed.

## Later the same night: pushed, checked, and B-7 fixed

- Pushed with Jason's go. After the publish, both retired pages answer
  404; `qdeco.com`, `privacy.html` and the three PNGs answer 200 and
  are byte-identical to the repo.
- B-7: Jason chose "leave as soon as the Save lands". Done stays
  enabled during a Save; pressed then (or ⌃⌥E), it reads "Leaving after
  the Save…" and edit mode closes when the Save lands, with "Saved, and
  edit mode is off." A failed Save keeps edit mode on with the edits.
  Checked in Chromium and WebKit with GitHub faked (2.5 s round trips):
  two rounds of Save then Done, a failed Save, Done with an unsaved
  change (still asks) and Done with none. Not yet tried in Safari.

