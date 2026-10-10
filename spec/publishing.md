# Publishing

**Status:** Built 2026-10-09 (`5c09c2a`, the workflow; the source switched by Jason the same evening). **Open work:** none.

Until 2026-10-09 GitHub Pages served the whole `main` branch, so every
committed file was public at qdeco.com, and the working docs were kept
out of git. Jason's decision (Projects standard, D10): track the docs
in this repo like thelivery does, and publish with a GitHub Actions
step that uploads only the site's files. The repo stays public, so the
docs can be read on GitHub, but they never appear on qdeco.com.

## The workflow

`.github/workflows/pages.yml`, as committed:

```yaml
name: Publish qdeco.com
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - name: Collect the site's files only
        run: |
          mkdir _site
          rsync -a ./ _site/ \
            --exclude '.git*' --exclude '_site' \
            --exclude 'CLAUDE.md' --exclude 'README.md' \
            --exclude 'spec' --exclude 'tools' --exclude '.claude' \
            --exclude 'Drop Offs'
      - uses: actions/upload-pages-artifact@v3
        with:
          path: _site
      - id: deployment
        uses: actions/deploy-pages@v5
```

The action versions match GitHub's own static-site starter workflow as of 2026-10-09.

## How it was switched

The order it was done in is in `spec/history/2026-10-09-publishing-switch.md`.
The setting lives on GitHub, not in the repo: Settings, Pages, Build
and deployment, Source: **GitHub Actions**. If it is ever set back to
"Deploy from a branch", every committed file is published again,
`CLAUDE.md` and `spec/` included.

## A new top-level file

The workflow publishes everything except the names it excludes, so a
new site file needs nothing. A new folder of working files must be
added to the exclude list before it is committed.
