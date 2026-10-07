---
'slate': minor
---

Deleting the only node in the editor, such as a lone image, now leaves an empty block instead of an editor with no children. An empty editor had no start point, so focusing or typing threw "Cannot get the start point in the node at path [] because it has no start text node".
