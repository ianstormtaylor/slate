---
'slate-react': minor
---

- Introduces a `useSlateSelection` hook that triggers whenever the selection changes.
- This also changes the implementation of SlateContext to use an incrementing value instead of an array replace to trigger updates
- Introduces a `useSlateWithV` hook that includes the version counter which can be used to prevent re-renders
