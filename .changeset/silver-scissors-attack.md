---
'slate-history': patch
---

Fix `HistoryEditor.withMerging`, `HistoryEditor.withNewBatch` and `HistoryEditor.withoutMerging` leaving the history flags corrupted when `fn` throws, and a nested `withNewBatch` that applies no operation clearing the pending split of the enclosing `withNewBatch`.
