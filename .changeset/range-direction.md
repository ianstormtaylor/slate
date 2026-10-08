---
'slate': minor
---

Add `Range.direction(range)`, which returns `'forward'`, `'backward'` or `'collapsed'`. `Range.isForward` and `Range.isBackward` are unchanged; a collapsed range still counts as forward, which is now documented.
