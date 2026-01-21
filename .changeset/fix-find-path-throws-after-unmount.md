---
'slate-dom': patch
---

Fix `findPath` throwing "Unable to find the path for Slate node" after component unmount

When `toSlatePoint` is called with `suppressThrow: true` (e.g., from `toSlateRange` during selection change handling), it should not throw errors. However, the internal `findPath` calls were not respecting this option, causing errors to be thrown when the component was unmounting and node references became stale.

This fix wraps the `findPath` calls in `toSlatePoint` with try-catch blocks that respect the `suppressThrow` option, returning `null` instead of throwing when the option is enabled.
