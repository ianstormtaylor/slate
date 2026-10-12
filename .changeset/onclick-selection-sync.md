---
'slate-react': patch
---

Sync the selection from the DOM before calling an `Editable` `onClick` handler, so `editor.selection` in the handler reflects the click instead of the previous selection.
