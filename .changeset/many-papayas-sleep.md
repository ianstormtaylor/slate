---
'slate': minor
---

Added `Path.commonDepth(path, another)` to calculate the similarity of two paths.
It returns the number of ancestors the two paths share (not including the root). It's equivalent to `Path.common(path, another).length` but doesnt allocate a new array.
