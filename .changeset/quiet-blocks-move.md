---
'slate': patch
---

Fix `Editor.positions` and `Transforms.move` returning points inside consecutive non-selectable elements, or inside a non-selectable first child of a void or read-only element. Deleting beside two non-selectable blocks, or beside a read-only block whose content is all non-selectable, now removes them instead of merging their text.
