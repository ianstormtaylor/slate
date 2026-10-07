---
'slate-dom': patch
---

Stop `deleteBackward('line')` from throwing when a line boundary cannot be measured against the DOM, such as when the editor's DOM is stale or not mounted. The line check now treats an unmeasurable range as being on a different line.
