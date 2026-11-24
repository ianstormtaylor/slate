---
'slate-react': patch
---

`Editable` no longer throws `Cannot resolve a Slate range from DOM range` when it re-syncs a stale selection of a focused editor while the page has no DOM selection: the re-sync now uses `ReactEditor.resolveSlateRange`, which returns `null` for an empty selection, instead of `toSlateRange` with `suppressThrow`, which still throws there.
