---
'slate-history': minor
---

Undo and redo now account for changes applied with `HistoryEditor.withoutSaving`. Saved steps are moved past each unsaved operation, so inserting a block above earlier typing, or inserting text before it, no longer makes undo remove the wrong characters. Steps whose content was removed, or that can no longer be applied, are dropped instead of changing other content.
