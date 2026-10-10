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

**Edit in place is built** (`spec/edit-in-place.md`). Jason's first
try on the live site found it did not start; the fix is committed
here and checked in headless Chromium, and **is not live until it is
pushed**. Safari and a real Save are still untried (B-2).

**The site is published by a GitHub Actions step**
(`spec/publishing.md`) that uploads only the site's files, so
`CLAUDE.md`, `spec/` and `tools/` are tracked in git and never appear
on qdeco.com. They can be read on GitHub while the repo is public.
Jason's own files stay out of git (`.git/info/exclude`).

## Next

1. **B-2**: Jason tries edit mode and a first Save on the live site.
   A Save now publishes through the workflow; check that it still does.
