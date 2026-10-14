---
'slate-react': patch
---

`Editor.deleteFragment` removes wholly selected sibling blocks for a hanging range outside isolated elements. Preserve native triple-click selections outside isolated elements. Backspace and cut now remove wholly selected sibling blocks when the native range hangs into the next block. Firefox keeps its native non-hanging selection behavior. Inside elements marked by `editor.isIsolated`, triple-click still selects only the current block's contents so deletion retains its structure. Older peer versions without `isIsolated` remain supported.
