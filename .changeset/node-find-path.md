---
'slate': minor
'slate-dom': patch
---

Add `Node.findPath(root, node)`, which finds a node's path by walking the tree and returns `undefined` if the node isn't there. It doesn't depend on rendering, so it works without slate-react, for example on a server. `DOMEditor.findPath` uses it as its fallback when the rendered node maps are stale.
