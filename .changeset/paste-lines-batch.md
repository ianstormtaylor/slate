---
'slate-dom': patch
---

Paste multi-line plain text with one `insertNodes` call for the middle lines instead of a split and an `insertText` per line. The first and last lines still go through `editor.insertText`; the middle lines no longer do. Pasting 22,000 lines runs about eight times faster.
