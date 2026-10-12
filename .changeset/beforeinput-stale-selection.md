---
'slate-react': patch
---

Read the DOM selection when a `beforeinput` event arrives, so input that follows a selection change before the browser fires `selectionchange` goes where the caret is.
