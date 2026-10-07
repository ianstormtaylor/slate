---
'slate-dom': patch
---

Only read `data-slate-fragment` from an HTML attribute when pasting, so pasted text that happens to contain `data-slate-fragment="…"` no longer makes the paste fail.
