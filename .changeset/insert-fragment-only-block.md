---
'slate': patch
---

Fix `insertFragment` into an editor whose only block is empty, which left an extra untyped empty block before the inserted content (a regression in 0.130).
