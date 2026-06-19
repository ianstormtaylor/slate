---
"slate-dom": patch
---

Fix `toSlatePoint` not respecting `suppressThrow` when `toSlateNode` throws. Previously only errors from `findPath` were guarded; errors from the preceding `toSlateNode` call would propagate unconditionally even with `suppressThrow: true`.
