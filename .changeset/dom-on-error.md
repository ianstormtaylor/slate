---
'slate-dom': minor
'slate-react': minor
---

Add `editor.onDOMError` and the lookups `DOMEditor.resolveDOMPoint`, `DOMEditor.resolveDOMRange` and `DOMEditor.resolveEventRange`.

The resolve lookups return `null` instead of throwing. While the DOM is still catching up with the model (the editor isn't mounted, a render is pending, or Android input hasn't been applied yet), a missing point is ordinary and isn't reported. Once the DOM has settled, a point that still can't be found means a broken rendering contract, such as an element that doesn't render its `children`, and is reported through `editor.onDOMError`, which passes it to the browser's `reportError` by default.

Slate's own handlers now use these lookups with no try/catch. ArrowUp near a trailing newline, the `beforeinput` link-end check, shift-clicking past a selected void and restoring the DOM selection no longer throw out of their handlers. Selection syncing, which used to swallow every failure, now reports only the broken-contract case.

slate-react now requires slate-dom 0.141.0 or later.
