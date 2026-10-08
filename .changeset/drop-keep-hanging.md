---
'slate-react': patch
---

Moving whole lines by dragging or cutting no longer adds an empty line. Whole top-level blocks are now moved as blocks. Nested content, like list items and table cells, is moved without its trailing line break, so no containers get merged. Dropping text back onto its own selection is now a no-op, and drag-and-drop deletes through `editor.deleteFragment`, like cut does, so plugins that guard deletion apply to both.
