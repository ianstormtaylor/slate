# slate-history

## 0.66.0

### Patch Changes

- [#4500](https://github.com/ianstormtaylor/slate/pull/4500) [`50bb3d7e`](https://github.com/ianstormtaylor/slate/commit/50bb3d7e32d640957018831526235ca656963f1d) Thanks [@tubbo](https://github.com/tubbo)! - Upgrade `is-plain-object` to v5.0.0

## 0.65.3

### Patch Changes

- [#4430](https://github.com/ianstormtaylor/slate/pull/4430) [`748bf750`](https://github.com/ianstormtaylor/slate/commit/748bf7500557507a999796749cef28b0d1eb79d9) Thanks [@TheSpyder](https://github.com/TheSpyder)! - Removed unnecessary (and outdated) dependency on `immer`

## 0.62.0

### Minor Changes

- [#4154](https://github.com/ianstormtaylor/slate/pull/4154) [`7283c51f`](https://github.com/ianstormtaylor/slate/commit/7283c51feb83cb8522bc16efce09bb01c29400b9) Thanks [@ianstormtaylor](https://github.com/ianstormtaylor)! - **Start using [🦋 Changesets](https://github.com/atlassian/changesets) to manage releases.** Going forward, whenever a pull request is made that fixes or adds functionality to Slate, it will need to be accompanied by a changset Markdown file describing the change. These files will be automatically used in the release process when bump the versions of Slate and compiling the changelog.

### Patch Changes

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) Thanks [@ianstormtaylor](https://github.com/ianstormtaylor)! - Fixed history logic to not store focus and blur selection changes in the history.
