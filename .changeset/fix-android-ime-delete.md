---
'slate-react': patch
---

Flush Android text deletions without waiting for another input event, and avoid an extra change notification when restoring unchanged marks.
