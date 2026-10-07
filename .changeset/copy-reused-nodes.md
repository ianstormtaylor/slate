---
'slate-dom': patch
---

Copy node objects passed to `insertNodes` that are already in a document, or that were inserted before, so each position gets its own object. Reusing an object, such as a template node inserted twice, made two nodes share one key and one parent entry, which broke rendering, selection and `findPath`. A node's first insertion keeps its object identity.
