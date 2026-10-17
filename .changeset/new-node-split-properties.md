---
'slate': minor
---

Add `editor.getSplitProperties(node, path)` to choose the properties copied to the new right-hand node by `Transforms.splitNodes`. The default remains `Node.extractProps(node)`. Applications can omit or replace IDs while preserving text marks for Enter, fragment insertion and partial-range transforms.

`BaseEditor` now requires `getSplitProperties`; `createEditor` supplies it. Structural editor implementations and mocks must add the method.
