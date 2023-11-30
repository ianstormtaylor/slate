# slate-hyperscript

## 0.100.0

### Minor Changes

- [#5528](https://github.com/ianstormtaylor/slate/pull/5528) [`c4c14882`](https://github.com/ianstormtaylor/slate/commit/c4c14882edf13828f6583a88e50754ce63583bd7) Thanks [@dylans](https://github.com/dylans)! - Update dependencies to React 18, Node 20, TS 5.2, etc.

## 0.81.3

### Patch Changes

- [#5042](https://github.com/ianstormtaylor/slate/pull/5042) [`11a93e65`](https://github.com/ianstormtaylor/slate/commit/11a93e65de4b197a43777e575caf13d7a05d5dc9) Thanks [@bryanph](https://github.com/bryanph)! - Upgrade next.js and source-map-loader packages

## 0.77.0

### Patch Changes

- [#4932](https://github.com/ianstormtaylor/slate/pull/4932) [`1ff6e690`](https://github.com/ianstormtaylor/slate/commit/1ff6e6909353a2e8088dcc8c2bacad15381652a4) Thanks [@e1himself](https://github.com/e1himself)! - Export `createText` creator from `slate-hyperscript` package

## 0.67.0

### Patch Changes

- [#4555](https://github.com/ianstormtaylor/slate/pull/4555) [`c29eea02`](https://github.com/ianstormtaylor/slate/commit/c29eea022ec943f0c63278e9058fe1267f7dff01) Thanks [@bryanph](https://github.com/bryanph)! - createEditor is now exported from slate-hyperscript, making it easier to set up custom editor tests

  For example:

  ```
  const jsx = createHyperscript({
    creators: {
      editor: createEditor(aFunctionThatReturnsAnEditorObject)
    },
    elements: {
      block: { type: 'block' },
      inline: { type: 'inline' }
    }
  })
  ```

## 0.66.0

### Patch Changes

- [#4500](https://github.com/ianstormtaylor/slate/pull/4500) [`50bb3d7e`](https://github.com/ianstormtaylor/slate/commit/50bb3d7e32d640957018831526235ca656963f1d) Thanks [@tubbo](https://github.com/tubbo)! - Upgrade `is-plain-object` to v5.0.0

## 0.62.0

### Minor Changes

- [#4154](https://github.com/ianstormtaylor/slate/pull/4154) [`7283c51f`](https://github.com/ianstormtaylor/slate/commit/7283c51feb83cb8522bc16efce09bb01c29400b9) Thanks [@ianstormtaylor](https://github.com/ianstormtaylor)! - **Start using [🦋 Changesets](https://github.com/atlassian/changesets) to manage releases.** Going forward, whenever a pull request is made that fixes or adds functionality to Slate, it will need to be accompanied by a changset Markdown file describing the change. These files will be automatically used in the release process when bump the versions of Slate and compiling the changelog.
