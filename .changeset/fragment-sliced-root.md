---
'slate': patch
---

Make `Node.fragment` only walk the top-level blocks the range covers, so copying or cutting in a large document no longer takes time proportional to the whole document.
