---
'slate-react': patch
---

Keep the browser's native triple-click selection outside `editor.isIsolated` elements, so Backspace and cut after a triple-click in Chrome and Safari remove the whole block as in a plain contenteditable. Inside isolated elements, triple-click still selects only the current block's contents. Firefox keeps its native non-hanging selection.
