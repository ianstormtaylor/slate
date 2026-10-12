---
'slate-hyperscript': patch
---

Strip Babel's `__self` and `__source` development metadata from hyperscript attributes so generated documents remain serializable and do not contain local source paths.
