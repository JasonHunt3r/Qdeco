# qdeco.com — backlog

Open items only. A finished item leaves this file: its story goes to
the day's file in `spec/history/`.

Next free ID: B-10

## Open

- **B-3** The privacy policy mentions Calm, margins and background in `localStorage`; it doesn't mention the edit token (only on Jason's own browser, only if he uses edit mode). Probably fine; add a line if one is wanted.
- **B-5** The page's on-screen names still say BGTools / UP Scaler; the family's names are now **BGtools** and **UP scaler** (RhythmIO repo, 2026-10-09).
- **B-7** After a Save the Done button looked greyed and took two clicks (Jason, Safari, 2026-10-09). Done is disabled while a Save runs, and a disabled button swallows a click silently (seen in WebKit and Chromium, GitHub faked). Likely, not yet checked in Safari: the first click landed mid-Save. Jason picks the fix: keep Done clickable and say "Still saving", or leave once the Save lands. Details: `spec/history/2026-10-09-retired-pages-and-docs.md`.
- **B-8** When an icon master (`*-icon.png`) changes, nothing says the page's inline copy is now behind (`spec/site.md`, "Where the page's pictures come from").
- **B-9** What a browser tab, a search result and a pasted link show: the home page's `<title>` is "Qdeco Presenter Demo", and it has no description, no link-preview image and no favicon. The wording and the picture are Jason's.
