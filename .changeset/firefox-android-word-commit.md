---
'slate-react': patch
---

Firefox for Android no longer splits a word across blocks when a keyboard suggestion is accepted in an empty paragraph. Firefox commits the word as one `insertText` per character at offsets it computed first; once the first character re-rendered the empty leaf, the rest of the word went into the next block. A character that arrives within 25 ms of the previous one and targets somewhere other than the editor's selection is now inserted at the selection instead (#6343).
