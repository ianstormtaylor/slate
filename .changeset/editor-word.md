---
'slate': minor
'slate-dom': minor
'slate-react': minor
---

Add `Editor.word`, which returns the range of the word around a point within its block. Words can cross mark changes and inline links but stop at voids, and `isWordCharacter` lets you define your own word characters. `ReactEditor.getWord` also includes text an input method is still composing.

The `'word'` unit (word deletion, word movement, and `Editor.before`/`after`/`positions`) now uses `Intl.Segmenter`, where available, to split runs of word characters. Chinese, Japanese and Thai text without spaces now deletes and moves one word at a time instead of a whole phrase. Text with spaces between words is unaffected.
