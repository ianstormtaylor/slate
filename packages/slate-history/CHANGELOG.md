# slate-history

## 0.115.0

### Patch Changes

- [#5866](https://github.com/ianstormtaylor/slate/pull/5866) [`7f5f9e1c`](https://github.com/ianstormtaylor/slate/commit/7f5f9e1c626e61ec476087212b22ee9ff86538e4) Thanks [@nabbydude](https://github.com/nabbydude)! - Fix certain undos undoing more than they should

- [#5862](https://github.com/ianstormtaylor/slate/pull/5862) [`98b115b7`](https://github.com/ianstormtaylor/slate/commit/98b115b7e1ce8a9bfec57f80bcb9a4e11152eca5) Thanks [@12joan](https://github.com/12joan)! - Increase minimum `slate` version to `0.114.3`

- [#5859](https://github.com/ianstormtaylor/slate/pull/5859) [`72532fd2`](https://github.com/ianstormtaylor/slate/commit/72532fd2d7be594251ea26fefb5c1ce8337b76ed) Thanks [@12joan](https://github.com/12joan)! - Optimize `isElement`, `isText`, `isNodeList` and `isEditor` by removing dependency on `is-plain-object` and by performing shallow checks by default. To perform a full check, including all descendants, pass the `{ deep: true }` option to `isElement`, `isNodeList` or `isEditor`.

## 0.113.1

### Patch Changes

- [#5837](https://github.com/ianstormtaylor/slate/pull/5837) [`701d5f32`](https://github.com/ianstormtaylor/slate/commit/701d5f320f37733071150dd0f78201f3bf7bfdc9) Thanks [@ederzz](https://github.com/ederzz)! - fix: add try/finally block in withoutSaving method to ensure state restoration

## 0.110.3

### Patch Changes

- [#5747](https://github.com/ianstormtaylor/slate/pull/5747) [`0e1e4b4d`](https://github.com/ianstormtaylor/slate/commit/0e1e4b4dbf470d7ec795309e510ce683674a4ce5) Thanks [@zbeyens](https://github.com/zbeyens)! - Add `HistoryEditor.withNewBatch`

## 0.109.0

### Minor Changes

- [#5696](https://github.com/ianstormtaylor/slate/pull/5696) [`e5fed793`](https://github.com/ianstormtaylor/slate/commit/e5fed793e7ed592298af2fa1fc8d2dde21ebf326) Thanks [@felixfeng33](https://github.com/felixfeng33)! - Add `withMerging`

## 0.100.0

### Minor Changes

- [#5528](https://github.com/ianstormtaylor/slate/pull/5528) [`c4c14882`](https://github.com/ianstormtaylor/slate/commit/c4c14882edf13828f6583a88e50754ce63583bd7) Thanks [@dylans](https://github.com/dylans)! - Update dependencies to React 18, Node 20, TS 5.2, etc.

## 0.93.0

### Minor Changes

- [#5382](https://github.com/ianstormtaylor/slate/commit/bab6943be9e0a307538c29a9dc5fcf23c09c5e40) Thanks [@reinvanimschoot](https://github.com/reinvanimschoot)! - Extracts history push to own function

## 0.86.0

### Patch Changes

- [#5197](https://github.com/ianstormtaylor/slate/pull/5197) [`70b64dc8`](https://github.com/ianstormtaylor/slate/commit/70b64dc8f10199658ac09bfef141b56187498652) Thanks [@jacobcarpenter](https://github.com/jacobcarpenter)! - Fix isHistory check.

## 0.85.0

### Minor Changes

- [#4717](https://github.com/ianstormtaylor/slate/pull/4717) [`d73026ee`](https://github.com/ianstormtaylor/slate/commit/d73026eed2d190da6153e91a914717978b155d8e) Thanks [@bryanph](https://github.com/bryanph)! - Changes how selections are stored in the history resulting in more consistent results

## 0.81.3

### Patch Changes

- [#5042](https://github.com/ianstormtaylor/slate/pull/5042) [`11a93e65`](https://github.com/ianstormtaylor/slate/commit/11a93e65de4b197a43777e575caf13d7a05d5dc9) Thanks [@bryanph](https://github.com/bryanph)! - Upgrade next.js and source-map-loader packages

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
