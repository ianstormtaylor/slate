---
'slate': patch
---

Fix deleteBackward behavior for Thai script where deleting N character(s) backward should delete
N code point(s) instead of an entire grapheme cluster
