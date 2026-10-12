---
'slate-react': patch
---

Stop re-rendering every text node in a block when only one of them changes. Text and leaf components now compare what they use from the parent (its properties, whether the text is its last child, and whether the block is empty) instead of the parent object itself.
