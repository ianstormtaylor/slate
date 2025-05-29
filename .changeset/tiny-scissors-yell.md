---
'slate-react': minor
---

- Implement experimental chunking optimization (disabled by default, see https://docs.slatejs.org/walkthroughs/09-performance).
- Add `useElement` and `useElementIf` hooks to get the current element.
- **BREAKING CHANGE:** Decorations are no longer recomputed when a node's parent re-renders, only when the node itself re-renders or when the `decorate` function is changed.
  - Ensure that `decorate` is a pure function of the node passed into it. Depending on the node's parent may result in decorations not being recomputed when you expect them to be.
  - If this change impacts you, consider changing your `decorate` function to work on the node's parent instead.
  - For example, if your `decorate` function decorates a `code-line` based on the parent `code-block`'s language, decorate the `code-block` instead.
  - This is unlikely to result in any performance detriment, since in previous versions of `slate-react`, the decorations of all siblings were recomputed when one sibling was modified.
- Increase minimum `slate-dom` version to `0.115.0`.
- Deprecate the `useSlateWithV` hook
- PERF: Use subscribable pattern for `useSlate`, `useSelected` and decorations to reduce re-renders.
