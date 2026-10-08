---
'slate': patch
---

Backspace at the start of a block that follows a list or table no longer pulls that block into the list or table. An empty previous block is now only removed in place of the merge when it's a sibling; otherwise the block merges into it as usual.
