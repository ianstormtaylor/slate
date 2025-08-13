---
'slate': patch
---

- Fix error when a non-selectable node has no next or previous node
- Do not return points from `Editor.positions` that are inside non-selectable nodes
  - Previously, `editor.isSelectable` was handled incorrectly inside `Editor.positions`. When encountering a non-selectable node, it would immediately return the point before or after it (depending on `reverse`), but it would not skip returning points inside the non-selectable node if more than one point was consumed from `Editor.positions`.
