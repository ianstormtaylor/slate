---
'slate-react': patch
---

Restore the DOM on Android after a deletion that changes nothing, such as Backspace in an empty editor, so the next composition's text isn't removed while it is typed.
