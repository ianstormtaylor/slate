---
'slate-react': patch
---

Flush Android backward text deletions without waiting for another input event, retain the typing delay when no action is pending, cancel superseded flush timers, and avoid an extra change notification when restoring unchanged marks.
