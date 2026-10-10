# 2026-10-09: edit in place on qdeco.com

Jason asked for a way to reach "the backend", or edit in place, knowing the
site is on GitHub Pages. Pages is static: no server, no secrets, every file
public, every change a commit. Options laid out (edit in place via the
GitHub API, github.dev, a CMS like Pages CMS / Decap, or Drop Offs); he
chose edit in place, for **text and pictures**, **⌃⌥E**, **saving straight
to the live site**, plus a way to make his window's look the default ("it's
a pain going back and forth to set fine details about the layout").

Built in two commits' worth, pushed as `4041588`: 32 `data-e` keys added to
`index.html` (checked byte-identical once stripped), the 1200 px cap made
`MAXW`, the padding made CSS variables with the old numbers as fallbacks, a
loader for ⌃⌥E, and `edit.js`. Tested in Node: the edits change exactly
their spots. Not yet tried in a browser; Jason tries it live.
