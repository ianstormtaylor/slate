---
'slate-dom': minor
---

Multi-line plain-text paste now builds the lines into a fragment and calls `editor.insertFragment` once, instead of splitting the block and calling `editor.insertText` for each line. Pasting 22,000 lines runs about eight times faster.

Changes plugins can see:

- Outside inlines, `insertFragment` overrides now receive multi-line plain-text pastes, and `insertText` overrides no longer see them. Single-line pastes still go through `insertText`.
- The operations are an `insert_node` per middle line instead of a `split_node` per line. Code that matches operation types in `apply` sees the new shape.
- Every pasted line gets the block properties and marks at the caret, including pending `editor.marks`.
- With the caret inside an inline such as a link, every line still stays inside it, as before. The first and last lines go through `insertText`, and the middle lines are inserted with one `insertNodes` call instead of one split per line.
