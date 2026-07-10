---
'slate-history': patch
---

fix: wrap withMerging, withNewBatch, and withoutMerging in try/finally to ensure state cleanup on error
