# slate

## 0.62.1

### Patch Changes

- [#4193](https://github.com/ianstormtaylor/slate/pull/4193) [`fd70dc0b`](https://github.com/ianstormtaylor/slate/commit/fd70dc0b2c0d06edb9490874fb831161b9759cba) Thanks [@beorn](https://github.com/beorn)! - Fixed insert and remove text operations to no-op without any text.

* [#4078](https://github.com/ianstormtaylor/slate/pull/4078) [`2dad21d1`](https://github.com/ianstormtaylor/slate/commit/2dad21d1d75750e7148b10bdea3ce921a79cbf33) Thanks [@TheSpyder](https://github.com/TheSpyder)! - Fixed inversion of `set_node` operations that delete properties on nodes.

- [#4168](https://github.com/ianstormtaylor/slate/pull/4168) [`95f402c5`](https://github.com/ianstormtaylor/slate/commit/95f402c59414331b2eeca9a19bd2c73c0ab6cd6c) Thanks [@ridhambhat](https://github.com/ridhambhat)! - Fixed a bug in splitting and applying overlapping marks to text nodes.

## 0.62.0

### Minor Changes

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - **Updated `Text.equals` to deeply compare text node properties.** Previously it only did a shallow comparison, but this made it harder to keep track of more complex data structures at the text level.

* [#4154](https://github.com/ianstormtaylor/slate/pull/4154) [`7283c51f`](https://github.com/ianstormtaylor/slate/commit/7283c51feb83cb8522bc16efce09bb01c29400b9) Thanks [@ianstormtaylor](https://github.com/ianstormtaylor)! - **Start using [🦋 Changesets](https://github.com/atlassian/changesets) to manage releases.** Going forward, whenever a pull request is made that fixes or adds functionality to Slate, it will need to be accompanied by a changset Markdown file describing the change. These files will be automatically used in the release process when bump the versions of Slate and compiling the changelog.

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - **Added support for custom selection properties.** Previously you could set custom properties on the selection objects but it was not a fully supported feature because there was no way to delete them later. Now custom properties are officially supported and deleting them once set is possible.

### Patch Changes

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed `move_node` operations to normalize the node in question.

* [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Added memoization logic to `Node.isNodeList` and `Editor.isEditor` to speed up common code paths.

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed a bug when merging deeply nested multi-child nodes.

* [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed a bug when deleting a hanging range with a trailing void block node.

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed a bug in `Editor.positions` which caused it to sometimes skip positions in text nodes that were segmented across inlines or marks.
