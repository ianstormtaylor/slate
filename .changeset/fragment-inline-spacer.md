---
'slate': patch
---

Insert the empty text required by normalization when fragment replacement leaves an insertion point at a block-leading or trailing inline. Resolve the adjacent text within the block so insertion stays there and works before emptied containers normalize.

An invalid `mergeNodes` call combining block children with text or inline children now throws with both node paths instead of allowing normalization to discard content. Empty children, text-node merges and the previous-node removal policy keep their existing behavior.
