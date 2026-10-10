# qdeco.com — status

**Read this first each session.** The state of play, in the present
tense. Rules are in `CLAUDE.md`, what the site is in `spec/site.md`,
what is left in `spec/backlog.md`, what happened in `spec/history/`.
This file is rewritten, not added to, and stays at 150 lines or fewer.

Repo: `~/Projects/Qdeco`, pushed to **github.com/JasonHunt3r/Qdeco**
(`main`). **A push to `main` publishes the site within about a minute.**

## Where it stands

**The site is live**: one page, `index.html` ("On the Margins"), with
`privacy.html` (`spec/site.md`).

**Edit in place works on the live site** (`spec/edit-in-place.md`):
Jason edits in Safari and Saves with his token. Until the two fixes
below are pushed, **only the first Save in any minute lands**; a second
one is refused. Committed here and **not live until pushed**: Saves
always read the fresh file from GitHub (the cause of the refusals), and
Done waits for a Save in flight. Checked in Chromium only (B-6).

**The site is published by a GitHub Actions step**
(`spec/publishing.md`) that uploads only the site's files, so
`CLAUDE.md`, `spec/` and `tools/` are tracked in git and never appear
on qdeco.com. They can be read on GitHub while the repo is public.
Jason's own files stay out of git (`.git/info/exclude`).

## Next

1. Push the two Save fixes, when Jason says; then B-6.
2. The open backlog items (`spec/backlog.md`).
