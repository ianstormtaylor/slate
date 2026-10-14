---
'slate-dom': minor
'slate-react': minor
---

Add `editor.onError`. It receives DOM mapping errors that Slate catches in its own event handlers and selection syncing, and by default passes them to the browser's `reportError`. ArrowUp near a trailing newline, the `beforeinput` link-end check, shift-clicking past a selected void and restoring the DOM selection used to throw out of their handlers; they now report the error and carry on. Selection syncing used to ignore these failures; it now reports them, except while Android input or a re-render is still pending.
