---
'slate-react': minor
---

- Update `RenderLeafProps` to receive the `Leaf` type from `slate`, which may include an optional nested `position: { start, end, isFirst, isLast }` property if the text node was split by decorations. Useful to render something only in a single leaf per text node.
