---
'slate': minor
'slate-dom': minor
'slate-react': minor
---

Add `Editor.word`, which returns the range of the word around a point within its block. Words can cross mark changes and inline links but stop at voids. By default it uses `Intl.Segmenter`, so Chinese, Japanese and Thai words are found too, and falls back to the `'word'` unit's rules where `Intl.Segmenter` is missing. `isWordCharacter` lets you define your own word characters. `ReactEditor.getWord` also includes text an input method is still composing.
