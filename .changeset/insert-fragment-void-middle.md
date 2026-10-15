---
'slate': patch
---

`insertFragment` now splits the block when block-level nodes such as a void image are pasted mid-block, so they land between the two halves instead of above the block, and the cursor moves to the start of the second half. Schemas that don't allow blocks inside a structure (for example a list item's text wrapper) should override `insertFragment` to move those nodes elsewhere before calling the original.
