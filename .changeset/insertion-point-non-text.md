---
'slate': patch
---

Fix insertions at a collapsed selection that isn't in a text node, such as one pointing at an inline element in an unnormalized document, throwing `Cannot get the leaf node`. The opt-in edge affinity now leaves those points to the transform, as before 0.141.
