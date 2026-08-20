---
'slate-react': patch
---

Skip `Selection.collapseToEnd()` during composition selection-sync when the live DOM selection has no ranges, so a cleared selection no longer throws `InvalidStateError` and unmounts the editor.
