# Qdeco: unpublish the retired pages, and the stale docs — work order for CC

From App Claude, 2026-10-09, after checking the folder and the repo
against the day's work. Small, and docs-only apart from one line in the
workflow. Revised the same evening: the icon PNGs stay published. Plan mode first; **commit and push only when Jason says** (a
push publishes). `git pull` before starting: Saves from edit mode
commit straight to `main`.

Findings are Confirmed (read in the files named) unless marked.

| Step | Do | Done when |
|---|---|---|
| 1 | **Stop publishing the retired pages. The icon PNGs stay.** Jason, 2026-10-09: "we can switch fully to our latest version", and of the pictures: "we need them to be there, or rather that there are image resources available that are the most current, regardless of which commit they arrived in." Add `index-retired-*` to the `rsync` excludes in `.github/workflows/pages.yml`, and to the copy of the workflow in `spec/publishing.md`, in one commit. The retired files stay in the repo, as `CLAUDE.md` says. **Do not exclude the three icon PNGs** (`rhythmio-icon.png`, `bgtools-icon.png`, `upscaler-icon.png`): they are the 1024×1024 masters and stay published as the site's picture resources. | After the push, `qdeco.com/index-retired-2026-10-09.html` and `…-09b.html` answer "not found"; `qdeco.com`, `privacy.html` and the three PNGs are unchanged. |
| 1a | **Say in `spec/site.md` where the page's pictures come from** (Confirmed 2026-10-09 by decoding them): `index.html` does not load the PNGs. It carries six inline WebP copies, 160×160 and about 5 KB each (the three icons, each used twice), the same artwork as the masters. So a new master does not change the page: the page's copy is replaced through edit mode's picture picker, which redraws it at the spot's width. File a backlog item: when a master changes, nothing says the page's copy is now behind. | `spec/site.md` states both facts; the item has an ID. |
| 2 | **`spec/status.md` is a commit behind itself.** It says the two Save fixes are "not live until pushed" and lists pushing them as Next 1. They were pushed at `f68bbfa`. Rewrite those lines in the present tense. | Status names nothing as unpushed that is pushed. |
| 3 | **B-6.** Jason reports the second-Save-in-a-minute problem solved. Ask him in the plan step whether that was two Saves in Safari, one after Done and back in, which is B-6's whole test. If yes: B-6 leaves the backlog, its story goes to the day's history file, and `spec/edit-in-place.md`'s status line drops it. | Jason has answered; the three files agree. |
| 4 | **`spec/site.md` contradicts `spec/publishing.md` and `CLAUDE.md`.** It still says Pages serves the whole of `main`, and lists `spec/` among Jason's local-only files. Both were true when the text was moved in word for word. Replace the publishing sentence with a pointer to `spec/publishing.md` (cite, don't restate) and take `spec/` out of the local-only list. Its retired-pages line then says they are kept in the repo and not published. B-4 no longer applies to the retired pages; narrow it to `privacy.html` or close it, Jason's call. | A grep for "serving `main`" and for `spec/` in the local-only list finds nothing. |
| 5 | **Backlog, new item.** The home page's `<title>` is "Qdeco Presenter Demo", and it has no description, no link-preview image and no favicon: what a browser tab, a search result and a pasted link show. Wording and picture are Jason's. File it; do not write the copy. | A new ID in `spec/backlog.md`. |
| 6 | History file for the day and its README row; `tools/docs-check.sh`. | The checker passes. |

## For Jason, not this order

`tools/docs-check.sh` warns that `Qdeco history Jason's words.md` sits
at the repo root. That file is his and is git-excluded on purpose, so
the warning can never clear. The cure belongs in
`~/Projects/standards/template/tools/docs-check.sh` (skip files git
ignores), with the copies here and in jhg-cutcheck following. The same
checker warns on ClaudeCAM's root methodology docs, which the standard
says stay at the root; that wants an allow-list key in
`spec/docs-check.conf`. One small change to the standard, when he says.
