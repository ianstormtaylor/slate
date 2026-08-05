---
'slate': patch
---

Deeply compare nested data structures inside array properties on nodes for the purpose of merging identical text nodes. Previously, items in array properties were shallowly compared using `===`.
