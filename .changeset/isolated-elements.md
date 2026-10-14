---
'slate': minor
---

Add `editor.isIsolated(element)` for elements such as table cells whose content must not flow across their edges. Backspace, Delete and range deletion don't merge across an isolated element's edge, and `insertBreak` doesn't split one.
