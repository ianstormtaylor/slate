---
'slate': minor
---

Support `select` on `insertText`, `insertFragment`, `splitNodes`, `moveNodes` and `liftNodes`, complementing `insertNodes`. An explicit `select: true` moves the caret to the result even with an explicit `at`. Insertion and splitting select by default when `at` is omitted; moving retains its existing selection-following behavior by default. `select: false` prevents explicit reselection while operations still transform the existing selection.

`insertText` preserves a null selection by default; use `select: true` to create a caret after inserting into an unfocused document.
