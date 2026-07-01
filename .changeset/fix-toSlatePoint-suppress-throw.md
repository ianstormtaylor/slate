---
'slate-dom': patch
---

Fix `toSlatePoint` not respecting `suppressThrow` when `toSlateNode` throws. Only errors from `findPath` were guarded; errors from the preceding `toSlateNode` propagated unconditionally even with `suppressThrow: true`.
