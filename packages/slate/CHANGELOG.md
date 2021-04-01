# slate

## 0.62.0

### Minor Changes

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - **Updated `Text.equals` to deeply compare text node properties.** Previously it only did a shallow comparison, but this made it harder to keep track of more complex data structures at the text level.

## 0.61.1 (2021-03-29)

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed a bug when merging deeply nested multi-child nodes.

* [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed a bug when deleting a hanging range with a trailing void block node.

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed a bug in `Editor.positions` which caused it to sometimes skip positions in text nodes that were segmented across inlines or marks.
