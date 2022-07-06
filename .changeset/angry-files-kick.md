---
'slate-react': patch
---

This introduces a `useSlateSelection` hook and a `useSlateValue` hook for getting the selection end the editor value respectively. This also changes the implementation of SlateContext to use an incrementing value instead of an array replace to trigger updates
