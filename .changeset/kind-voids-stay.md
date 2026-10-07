---
'slate-dom': patch
---

Keep a forward DOM selection that ends inside a block void when converting it with `toSlateRange`, instead of unhanging it to the end of the previous block.
