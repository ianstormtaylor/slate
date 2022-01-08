---
'slate-react': patch
---

Android editable updates

- Remove logic to delay handling of text insertion
- Call Transforms.setSelection before Editor.insertText to adjust position
