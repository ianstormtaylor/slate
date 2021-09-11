---
'slate': minor
---

Switched from `fast-deep-equal` to a custom deep equality check. This restores the ability for text nodes with mark values set to `undefined` to merge with text nodes missing those keys.
