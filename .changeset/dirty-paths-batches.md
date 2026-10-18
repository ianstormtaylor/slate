---
'slate': patch
---

Batches inside `Editor.withoutNormalizing` spend less time on dirty path bookkeeping. An operation that can't map two dirty paths onto one, which is every path-changing operation except `merge_node`, no longer rebuilds the dirty path key set. 5,000 splits of one block in a batch go from about 7.9 s to 3.7 s. The dirty paths and their order are unchanged.
