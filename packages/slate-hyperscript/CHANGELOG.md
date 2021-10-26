# slate-hyperscript

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
