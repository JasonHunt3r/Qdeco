# CLAUDE.md — Qdeco (qdeco.com)

The public website for Qdeco, Jason's design company, and for the apps
it makes (RhythmIO, BGtools, UP scaler).

## What this is

A static site on GitHub Pages: plain HTML in the repo root, no build
step, with a custom domain (`CNAME`). `spec/site.md` says what each
file is.

## What it is not

- Not a store: GitHub Pages can only link out. Selling comes later, on
  a server of its own.
- Not only an apps page. Qdeco is the umbrella for all of Jason's
  design work; the Mac apps are one room of the house.

## The docs

| File | What it is, and when to read it |
|---|---|
| `spec/status.md` | **Read first each session.** The state of play. 150 lines at most. |
| `spec/backlog.md` | The to-do list: open items only, each with an ID. |
| `spec/site.md` | What the site is made of, and which of Jason's files are local only. |
| `spec/edit-in-place.md` | Editing the live page with ⌃⌥E, and **the contract** that hand edits to `index.html` must keep. Read before touching `index.html` or `edit.js`. |
| `spec/publishing.md` | How the site is published: a GitHub Actions step that uploads only the site's files. Read before adding a folder or changing the workflow. |
| `spec/history/` | Dated events. **Never read for current rules or state**, only for *why*. Start at its README. |

`Drop Offs/` is Jason's inbox: look there first, read what is new,
then move each file where it belongs. At every clear, follow the steps
in `~/Projects/CLAUDE.md` and run `tools/docs-check.sh`.

## Rules

- **A push to `main` publishes within about a minute.** Commit and
  push only when Jason asks.
- **Everything committed can be read on GitHub**, because the repo is
  public. The site itself gets only what the publishing workflow
  uploads: everything except the names it excludes
  (`spec/publishing.md`). A new folder of working files must be added
  to that exclude list before it is committed.
- **Jason's own files are never committed**: the Design Jam folder,
  `On The Margins web index/`, `Qdeco history Jason's words.md`,
  `index-local-*.html`, `Drop Offs/`. They are listed in
  `.git/info/exclude`. Run `git status` before any commit and stage
  files by name, never `git add -A`.
- **Pull before any local work.** A Save from edit mode commits
  straight to `main` on GitHub, so the Mac's copy falls behind
  without anyone touching it.
- **Keep the edit-in-place contract** when editing `index.html` by
  hand (`spec/edit-in-place.md`, "The contract").
- A retired page is kept in the repo under a dated name
  (`index-retired-2026-10-09.html`), not deleted.

## Names

The apps are **RhythmIO**, **BGtools** and **UP scaler**. The page
still says BGTools and UP Scaler in places (B-5).
