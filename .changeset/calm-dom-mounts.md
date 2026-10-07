---
'slate-dom': patch
---

`DOMEditor.hasDOMNode` returns `false` when the editor is not mounted, instead of throwing. A target cannot be inside an editor that has no DOM element.
