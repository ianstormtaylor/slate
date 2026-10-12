---
'slate-dom': patch
---

Return the correct path from `findPath` when it is called after an operation but before the editor re-renders, such as in `onChange`, instead of throwing or returning the old path.
