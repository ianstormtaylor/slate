---
'slate-react': patch
---

Fixes #5335. To prevent performance issues, make sure to wrap custom `renderPlaceholder` values in `useCallback`.
