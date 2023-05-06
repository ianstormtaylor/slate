---
'slate': patch
---

`Editor.insertFragment`, `Editor.insertNode`, `Editor.insertText` now accept `options`.
For all insert methods, the default location is now the editor selection if `at` is not defined, or the end of document if `editor.selection` is not defined.
