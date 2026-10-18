---
'slate-dom': minor
'slate-react': minor
---

Add `resolveDOMNode`, `resolveSlateNode`, `resolveSlatePoint` and `resolveSlateRange`, which return `null` instead of throwing, like `resolveDOMPoint` and `resolveDOMRange`. Unlike `suppressThrow: true`, `resolveSlatePoint` and `resolveSlateRange` also return `null` before `Editable` mounts and for a selection with no range. The `to` lookups and `suppressThrow` are unchanged.
