---
'slate-history': patch
---

Keep a transform's normalization in the same undo step inside `HistoryEditor.withoutMerging`. Undo steps now start only when the document is normalized, so undoing them no longer throws `Cannot find descendant at path` or restores a selection that points at a missing node.
