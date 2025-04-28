---
'slate': minor
---

- Update `Text.decorations` to return `Leaf[]`.
- Add `position?: { start, end, isFirst, isLast }` property to `Leaf` type.
- The `position` property is only added if decorations cause the text node to be split into multiple leaves.
