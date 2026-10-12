---
'slate-react': patch
---

Replace an expanded selection correctly when an IME composition starts right after selecting it. The selection is now synced before the composition starts, and Firefox no longer crashes or leaves the replaced text in the document.
