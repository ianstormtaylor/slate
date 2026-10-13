---
'slate': minor
'slate-dom': patch
---

Add Editor.hasRange to core and have DOMEditor.hasRange and ReactEditor.hasRange use it, falling back to the path check with older slate versions.
