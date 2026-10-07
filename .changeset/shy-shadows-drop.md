---
'slate-dom': patch
---

Resolve drop positions inside shadow DOM. `findEventRange` passes the editor's shadow root to `caretPositionFromPoint` where the browser supports it, instead of resolving to the shadow host and throwing "Cannot resolve a Slate point from DOM point".
