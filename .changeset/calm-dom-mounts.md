---
'slate-dom': minor
---

Add `DOMEditor.isMounted(editor)` to check whether the editor has a DOM element, and use it in `focus` and `hasDOMNode`. `hasDOMNode` now returns `false` for an editor that is not mounted, instead of throwing.
