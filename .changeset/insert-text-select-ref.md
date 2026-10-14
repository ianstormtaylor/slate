---
'slate': patch
---

Fix `insertText` leaving the selection past the end of the text when an `apply` override changes the inserted text. By default the selection follows the operation again, as before 0.138.0, and `select: true` selects the end of the text that was actually applied.
