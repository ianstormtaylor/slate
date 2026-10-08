---
'slate': patch
---

Only refill an emptied editor when a delete runs at the selection. In 0.130, `Transforms.delete(editor, { at: path })` also inserted an untyped empty block when it removed the last node, which left an extra block behind in code that deletes every block and then inserts new content. Programmatic deletes with an explicit `at` now act like `removeNodes` again.
