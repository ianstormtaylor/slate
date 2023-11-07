---
'slate-react': minor
---

Fixes a bug with `ReactEditor.focus` where it would throw an error if the editor was in the middle of applying pending operations.
With this change, setting focus will be retried until the editor no longer has any pending operations.
Calling `ReactEditor.focus` on a editor without a current selection, will now make a selection in the top of the document.
