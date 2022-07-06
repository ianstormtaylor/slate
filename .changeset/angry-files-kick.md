---
'slate-react': patch
---

* Introduces a `useSlateSelection` hook that triggers whenever the selection changes.
* This also changes the implementation of SlateContext to use an incrementing value instead of an array replace to trigger updates
