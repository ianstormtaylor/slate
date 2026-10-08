---
'slate-react': patch
---

`autoFocus` now focuses through `ReactEditor.focus`, which selects the start of the document when there's no selection, so you can type right away. Before, Firefox and Safari could end up focused with no selection, especially under React strict mode.
