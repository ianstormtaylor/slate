---
'slate-dom': patch
---

Fall back to deleting backward by character when deleting to the start of a line has an empty range, allowing empty blocks and block starts to merge with preceding content.
