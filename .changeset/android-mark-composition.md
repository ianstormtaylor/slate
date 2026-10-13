---
'slate-dom': patch
'slate-react': patch
---

Fix typing on Android right after toggling a mark with a collapsed selection. The first letter no longer moves the caret past the end of the previous leaf, which closed the soft keyboard and scattered the following letters, and a composition into the new marked text is no longer interrupted by a re-render.
