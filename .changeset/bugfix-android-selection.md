---
'slate-react': patch
---

Fixed a bug on Android where Slate would attempt to reconcile the DOM selection with Slate's internal selection while there are pending diffs or while the pending diffs are being flushed, which could result in an error being thrown because of a mismatch between the state of the DOM and Slate's internal representation if they were out of sync.
