---
'slate-dom': minor
'slate-react': minor
---

Add `editor.onDOMError`. It receives DOM mapping failures that Slate's own handlers can't recover from, and by default passes them to the browser's `reportError`.

Slate's handlers now look up the DOM in two steps. While the DOM is still catching up with the model (the editor isn't mounted or a render is pending), the lookup returns nothing and the handler carries on quietly. Once the DOM has settled, a point that still can't be found means a broken rendering contract, such as an element that doesn't render its `children`, and that is reported through `editor.onDOMError`.

ArrowUp near a trailing newline, the `beforeinput` link-end check, shift-clicking past a selected void and restoring the DOM selection used to throw out of their handlers; they no longer do. Selection syncing used to swallow every failure; it now reports the broken-contract case.
