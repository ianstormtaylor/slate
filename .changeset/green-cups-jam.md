---
'slate': minor
'slate-dom': patch
'slate-history': patch
'slate-react': patch
---

Add `Editor.withBatch` and `Transforms.applyBatch`, route batched operations through the shared apply engine, and keep DOM, history, and React integrations aligned with the new batch semantics.
