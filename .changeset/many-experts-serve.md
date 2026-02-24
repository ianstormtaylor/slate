---
'slate': minor
'slate-dom': patch
---

Optimized all location transform functions and added checks to avoid calling them if not necessary.
Added `PathTransformingOperation`, and `PointTransformingOperation` as subsets of `Operation` (both of which have a `path` property) and also `Operation.transformsPaths(op)` and `Operation.transformsPoints(op)` as type guards for them.
