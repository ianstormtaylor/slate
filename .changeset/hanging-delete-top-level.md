---
'slate': patch
'slate-react': patch
---

Limit whole-block deletion of a hanging selection, and native triple-click selections, to top-level blocks. Nested blocks such as table cells and list items keep the previous behavior, so cutting or dragging across cells in editors without `editor.isIsolated` no longer removes cells. After undoing a whole-block deletion, the default `scrollSelectionIntoView` scrolls to the restored text instead of the start of the following block.
