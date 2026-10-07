---
'slate-dom': patch
---

Keep the editor's selection when `DOMEditor.focus` is called with a void, such as a mention, selected. The DOM selection is now applied after focusing the editable, because Chromium resets a caret placed inside non-editable content when focus arrives afterwards.
