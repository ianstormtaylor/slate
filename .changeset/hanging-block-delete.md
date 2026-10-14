---
'slate': minor
---

`Editor.deleteFragment` removes wholly selected sibling blocks when the selection starts at the start of a block and ends at the start of a later sibling, instead of emptying them. Ranges inside `editor.isIsolated` elements keep the previous behavior.
