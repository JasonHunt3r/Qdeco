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
Jason opened it in Safari and made a first real Save with his token
(`b5da507`). A fix for leaving while a Save is still in flight is
committed here and **is not live until it is pushed**.

**The site is published by a GitHub Actions step**
(`spec/publishing.md`) that uploads only the site's files, so
`CLAUDE.md`, `spec/` and `tools/` are tracked in git and never appear
on qdeco.com. They can be read on GitHub while the repo is public.
Jason's own files stay out of git (`.git/info/exclude`).

## Next

1. Push the Save fix, when Jason says.
2. The open backlog items (`spec/backlog.md`).
