---
'slate': minor
'slate-dom': patch
---

Added `Editor#asMutationBatch` to enhance performance for applying many operations at once. During a mutation batch elements can adapt to multiple changes to their children without duplicating into multiple immutable references. Element references from before the batch are never changed, but any new reference created during the batch is treated as mutable until the batch ends--at which point its reference is locked in and is treated as immutable. :warning: During a batch the node tree will update as normal but nodes captured during the batch can't be treated as snapshots because they may change later in the batch. Also added `Editor#isBatchingMutations` to check if currently in a batch. 
