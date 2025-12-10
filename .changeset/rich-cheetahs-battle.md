---
'slate': minor
'slate-react': patch
'slate-dom': patch
---

Add `Editor.isEditorNode`, `Element.isElementNode`, and `Text.isTextNode` as alternative type guards for when we already know the object is a node.
Use these new functions instead of `isEditor`, `isElement`, and `isText` whenever possible, the classic functions are only necessary for typechecking an entirely unknown object.
===
