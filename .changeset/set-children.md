---
'slate': minor
'slate-history': minor
---

Add `Transforms.setChildren(editor, children)` and the overridable `editor.setChildren` method, which apply an outside document through Slate operations instead of replacing `editor.children`. Unchanged nodes are kept, matched by identity or deep equality; shared nodes move with `move_node`; and text changes become `insert_text`/`remove_text`, so the selection, refs and history stay valid.

`withHistory` records each `setChildren` call as one undo step, separate from typing before and after it.

`BaseEditor` now requires `setChildren`. `createEditor` supplies it, but editors built by hand and test mocks must add it.
