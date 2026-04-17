---
'slate': minor
'slate-dom': patch
'slate-history': patch
'slate-react': patch
---

Add `Editor.withBatch` and `Transforms.applyBatch` for opt-in batched operations. Defers normalization and `onChange` flush until a batch completes while keeping `editor.apply` as the per-operation plugin seam.
