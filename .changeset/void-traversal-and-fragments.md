---
'slate': patch
---

Honor `voids: true` when deleting an expanded target before inserting a fragment, and insert at the surviving start point when the range ends inside an inline element. Include text boundaries after inline voids in position traversal, and restart word segmentation there so `Editor.positions` agrees with `Editor.before` and `Editor.after`.
