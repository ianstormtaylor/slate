---
'slate-react': patch
---

Ignore DOM selection changes while focus is outside the editor (unless it's read-only). Firefox moves the DOM selection of a blurred editor when its content changes, so inserting text from outside the editor, such as from a toolbar button, used to jump the selection to the start.
