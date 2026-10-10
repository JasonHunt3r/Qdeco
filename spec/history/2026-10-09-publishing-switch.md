# 2026-10-09: publishing switched to a GitHub Actions step

B-1, closed the evening it was written. Its backlog entry, word for word:

- **B-1** Switch publishing from "deploy from branch" to the GitHub Actions step in `spec/publishing.md`, check the site, then track `CLAUDE.md`, `spec/` and `tools/` in git. Needs one setting changed by Jason on GitHub. Steps and checks are in that spec.

## What was done, in order

1. Jason added `.github/workflows/pages.yml` on GitHub from Safari
   (`5c09c2a`), with App Claude giving the steps. The run was expected
   to fail while Pages still deployed from the branch. It did not: it
   passed in 21 seconds, alongside the old `pages-build-deployment`
   run for the same commit.
2. Jason set Settings, Pages, Source to **GitHub Actions**.
3. He ran the workflow by hand (`workflow_dispatch`): success, 18
   seconds, deployed to https://qdeco.com/.
4. App Claude checked from outside: qdeco.com and `privacy.html` load.
5. The working docs were then committed: `CLAUDE.md`, `spec/`,
   `tools/`, and a `.gitignore`. The three names came out of
   `.git/info/exclude`; Jason's own files stay in it.

## Still to check

- After the docs commit is pushed: `qdeco.com/CLAUDE.md` and
  `qdeco.com/spec/status.md` return "not found".
- Edit in place still saves (B-2): a Save writes `index.html` through
  the GitHub API, and the push it makes now publishes through the
  workflow.

## Noted

The run warned that some actions target Node.js 20, which is
deprecated, and that `ubuntu-latest` moves to Ubuntu 26 from
2026-10-19. Neither needs action now; newer versions of the actions
will clear the first.
