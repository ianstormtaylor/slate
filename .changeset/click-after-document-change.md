---
'slate-react': patch
---

A click inside the editor whose handler changes the clicked node, for example a `<select>` that calls `setNodes` on its element or a suggestion that inserts text, no longer throws "Unable to find the path for Slate node". `Editable`'s click handling now returns when the clicked node is no longer in the document, which its existing check intended but `findPath` started throwing before it since 0.142.
