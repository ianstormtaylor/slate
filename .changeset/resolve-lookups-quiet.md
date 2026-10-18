---
'slate-dom': patch
'slate-react': patch
---

`resolveDOMPoint` and `resolveDOMRange` no longer report a miss through `editor.onDOMError`. A miss is often ordinary: a layout effect that measures the selection runs before the edited text's DOM is attached, and replacing `editor.children` can leave the selection past the end of the new text, so these were reported as broken rendering when nothing was wrong.

`resolveDOMRange` also returns `null` instead of throwing when the editor's window isn't registered yet, for example from a layout effect inside the first render, and checks the focus only when the anchor resolves. Scrolling the selection into view no longer throws when the unhung range ends in an element that doesn't render its children.
