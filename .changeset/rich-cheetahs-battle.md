---
'slate': minor
'slate-react': patch
'slate-dom': patch
---

Add `Node.isEditor`, `Node.isElement`, and `Node.isText` as alternative type guards for when we already know the object is a node.
Use these new functions instead of `Editor.isEditor`, `Element.isElement`, and `Text.isText` whenever possible, the classic functions are only necessary for typechecking an entirely unknown object.
===
