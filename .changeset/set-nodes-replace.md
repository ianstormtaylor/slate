---
'slate': minor
---

Add a `replace` option to `Transforms.setNodes` that removes every property not in `props`, in the same operation, so changing a node's type doesn't carry over properties from the old type. Undo restores them.
