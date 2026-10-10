# 2026-10-09: set up as a full project

Done by App Claude, working in the folder directly, under the Projects
standard Jason settled that day (`~/Projects/standards/STANDARD.md`).
His decision D6: Qdeco is "just a baby right now", but it will grow and
Claude Code and App Claude both need to manage it, so it gets the full
set like thelivery, not the small one. Docs only; nothing was
committed or pushed, so the live site is untouched.

## What moved

`spec/status.md` was frozen as `verbatim/status-2026-10-09.md`, then
split, word for word:

| Section | Now |
|---|---|
| "What the site is", "Jason's local files" | `spec/site.md` |
| "Edit in place" | `spec/edit-in-place.md` |
| "Open points" (three) | `spec/backlog.md`, B-3, B-4, B-5 |

## What was added

- `CLAUDE.md`, the project's rules and docs table. There was none.
- `spec/backlog.md`, with B-1 (publishing) and B-2 (Jason's first try
  of edit mode, from the old status).
- `spec/publishing.md`: decision D10, the workflow and the order to do
  it in.
- `spec/history/README.md`, `tools/docs-check.sh`.
- `CLAUDE.md` and `tools/` were added to `.git/info/exclude`, beside
  `spec/`, so nothing new can be published by accident before B-1.
