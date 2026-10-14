---
'slate': minor
---

Add `Editor.word`, which returns the range of the word around a point within its block. Words can cross mark changes and inline links but stop at voids. It uses the same word rules as the `'word'` unit, and `isWordCharacter` lets you define your own.
