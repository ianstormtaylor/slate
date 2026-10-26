---
'slate': patch
---

`editor.insertText` with an explicit `at` now inserts there when the editor has no selection, and no longer applies or clears pending `editor.marks`, which belong to the selection.
