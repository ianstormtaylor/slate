---
'slate-react': minor
---

- Implement experimental chunking optimization (disabled by default, see https://docs.slatejs.org/walkthroughs/09-performance).
- Add `useElement` and `useElementIf` hooks to get the current element.
- BREAKING CHANGE: Decorations are no longer recomputed when a node's parent re-renders, only when the node itself re-renders or when the decorate function is changed.
- PERF: Use subscribable pattern for `useSlate`, `useSelected` and decorations to reduce re-renders.
