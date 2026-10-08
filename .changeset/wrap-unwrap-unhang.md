---
'slate': minor
---

`Transforms.wrapNodes` and `Transforms.unwrapNodes` now unhang a range by default and accept `hanging`, like `setNodes`, `insertNodes`, `mergeNodes` and `removeNodes`. A selection that ends at the start of the next block no longer wraps or unwraps that block. Pass `hanging: true` to keep the old behavior.
