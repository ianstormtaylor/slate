# slate

## 0.103.0

### Minor Changes

- [#5621](https://github.com/ianstormtaylor/slate/pull/5621) [`d271c4be`](https://github.com/ianstormtaylor/slate/commit/d271c4be543027be2197f353d7ea61b51e9c48c6) Thanks [@felixfeng33](https://github.com/felixfeng33)! - Add a `shouldMergeNodesRemovePrevNode` editor method to control when `Transforms.mergeNodes` should remove the previous node rather than carrying out a merge operation.

### Patch Changes

- [#5620](https://github.com/ianstormtaylor/slate/pull/5620) [`4470f370`](https://github.com/ianstormtaylor/slate/commit/4470f370570ed1f2dce8b4b58d6117d3a87fa6c0) Thanks [@JohnCosta27](https://github.com/JohnCosta27)! - Making `normalizeNode` capable of normalizing erronous nodes, making slate more resilient.

## 0.102.0

### Minor Changes

- [#5543](https://github.com/ianstormtaylor/slate/pull/5543) [`3aaf3b51`](https://github.com/ianstormtaylor/slate/commit/3aaf3b517c2020c198bffe0f3aa8156746914408) Thanks [@mainhanu](https://github.com/mainhanu)! - Transform.insertNodes & Transform.insertFragment performance optimize

## 0.101.5

### Patch Changes

- [#5316](https://github.com/ianstormtaylor/slate/pull/5316) [`8ba3a9c0`](https://github.com/ianstormtaylor/slate/commit/8ba3a9c0348f73324b7c9ec32a4bbd348564d4f0) Thanks [@GeneralChauhan](https://github.com/GeneralChauhan)! - Punctuation Mark "+" Support Added

## 0.101.4

### Patch Changes

- [#5580](https://github.com/ianstormtaylor/slate/pull/5580) [`a374895b`](https://github.com/ianstormtaylor/slate/commit/a374895b3265ad60dbfe563eaa1a9415a440620e) Thanks [@Kaporos](https://github.com/Kaporos)! - Fix firefox double-click marks issue

## 0.101.1

### Patch Changes

- [#5562](https://github.com/ianstormtaylor/slate/pull/5562) [`91400a8e`](https://github.com/ianstormtaylor/slate/commit/91400a8e341b20194ce2fca078d8ba4b7a0476ea) Thanks [@YaoKaiLun](https://github.com/YaoKaiLun)! - Fix the 'select' parameter of the insertNodes function has been overridden

## 0.100.0

### Minor Changes

- [#5528](https://github.com/ianstormtaylor/slate/pull/5528) [`c4c14882`](https://github.com/ianstormtaylor/slate/commit/c4c14882edf13828f6583a88e50754ce63583bd7) Thanks [@dylans](https://github.com/dylans)! - Update dependencies to React 18, Node 20, TS 5.2, etc.

## 0.94.1

### Patch Changes

- [#5415](https://github.com/ianstormtaylor/slate/pull/5415) [`01f0210b`](https://github.com/ianstormtaylor/slate/commit/01f0210bccfe2c3a81c252f527bad9ded36a68ff) Thanks [@zbeyens](https://github.com/zbeyens)! - `Editor.insertFragment`, `Editor.insertNode`, `Editor.insertText` now accept `options`.
  For all insert methods, the default location is now the editor selection if `at` is not defined, or the end of document if `editor.selection` is not defined.

## 0.94.0

### Minor Changes

- [#5307](https://github.com/ianstormtaylor/slate/pull/5307) [`3243c7e3`](https://github.com/ianstormtaylor/slate/commit/3243c7e34ac2602618c67c88b1b7df07fde1c2ec) Thanks [@zbeyens](https://github.com/zbeyens)! - New Features:

  - All **`Editor`** and **`Transforms`** methods now call **`editor`** methods. For example: **`Transforms.insertBreak`** now calls **`editor.insertBreak`**.
  - **`editor.setNodes`** now calls **`setNodes`**, an exported function that implements the default editor behavior.
  - You can now override **`editor.setNodes`** with your own implementation.
  - You can use either **`Editor.setNodes`** or **`editor.setNodes`** in your code, and both will use your overridden behavior.

  The **`editor`** object now has many more methods:

  ```tsx
  export interface BaseEditor {
    // Core state.

    children: Descendant[]
    selection: Selection
    operations: Operation[]
    marks: EditorMarks | null

    // Overrideable core methods.

    apply: (operation: Operation) => void
    getDirtyPaths: (operation: Operation) => Path[]
    getFragment: () => Descendant[]
    isElementReadOnly: (element: Element) => boolean
    isSelectable: (element: Element) => boolean
    markableVoid: (element: Element) => boolean
    normalizeNode: (
      entry: NodeEntry,
      options?: { operation?: Operation }
    ) => void
    onChange: (options?: { operation?: Operation }) => void
    shouldNormalize: ({
      iteration,
      dirtyPaths,
      operation,
    }: {
      iteration: number
      initialDirtyPathsLength: number
      dirtyPaths: Path[]
      operation?: Operation
    }) => boolean

    // Overrideable core transforms.

    addMark: OmitFirstArg<typeof Editor.addMark>
    collapse: OmitFirstArg<typeof Transforms.collapse>
    delete: OmitFirstArg<typeof Transforms.delete>
    deleteBackward: (unit: TextUnit) => void
    deleteForward: (unit: TextUnit) => void
    deleteFragment: OmitFirstArg<typeof Editor.deleteFragment>
    deselect: OmitFirstArg<typeof Transforms.deselect>
    insertBreak: OmitFirstArg<typeof Editor.insertBreak>
    insertFragment: OmitFirstArg<typeof Transforms.insertFragment>
    insertNode: OmitFirstArg<typeof Editor.insertNode>
    insertNodes: OmitFirstArg<typeof Transforms.insertNodes>
    insertSoftBreak: OmitFirstArg<typeof Editor.insertSoftBreak>
    insertText: OmitFirstArg<typeof Transforms.insertText>
    liftNodes: OmitFirstArg<typeof Transforms.liftNodes>
    mergeNodes: OmitFirstArg<typeof Transforms.mergeNodes>
    move: OmitFirstArg<typeof Transforms.move>
    moveNodes: OmitFirstArg<typeof Transforms.moveNodes>
    normalize: OmitFirstArg<typeof Editor.normalize>
    removeMark: OmitFirstArg<typeof Editor.removeMark>
    removeNodes: OmitFirstArg<typeof Transforms.removeNodes>
    select: OmitFirstArg<typeof Transforms.select>
    setNodes: <T extends Node>(
      props: Partial<T>,
      options?: {
        at?: Location
        match?: NodeMatch<T>
        mode?: MaximizeMode
        hanging?: boolean
        split?: boolean
        voids?: boolean
        compare?: PropsCompare
        merge?: PropsMerge
      }
    ) => void
    setNormalizing: OmitFirstArg<typeof Editor.setNormalizing>
    setPoint: OmitFirstArg<typeof Transforms.setPoint>
    setSelection: OmitFirstArg<typeof Transforms.setSelection>
    splitNodes: OmitFirstArg<typeof Transforms.splitNodes>
    unsetNodes: OmitFirstArg<typeof Transforms.unsetNodes>
    unwrapNodes: OmitFirstArg<typeof Transforms.unwrapNodes>
    withoutNormalizing: OmitFirstArg<typeof Editor.withoutNormalizing>
    wrapNodes: OmitFirstArg<typeof Transforms.wrapNodes>

    // Overrideable core queries.

    above: <T extends Ancestor>(
      options?: EditorAboveOptions<T>
    ) => NodeEntry<T> | undefined
    after: OmitFirstArg<typeof Editor.after>
    before: OmitFirstArg<typeof Editor.before>
    edges: OmitFirstArg<typeof Editor.edges>
    elementReadOnly: OmitFirstArg<typeof Editor.elementReadOnly>
    end: OmitFirstArg<typeof Editor.end>
    first: OmitFirstArg<typeof Editor.first>
    fragment: OmitFirstArg<typeof Editor.fragment>
    getMarks: OmitFirstArg<typeof Editor.marks>
    hasBlocks: OmitFirstArg<typeof Editor.hasBlocks>
    hasInlines: OmitFirstArg<typeof Editor.hasInlines>
    hasPath: OmitFirstArg<typeof Editor.hasPath>
    hasTexts: OmitFirstArg<typeof Editor.hasTexts>
    isBlock: OmitFirstArg<typeof Editor.isBlock>
    isEdge: OmitFirstArg<typeof Editor.isEdge>
    isEmpty: OmitFirstArg<typeof Editor.isEmpty>
    isEnd: OmitFirstArg<typeof Editor.isEnd>
    isInline: OmitFirstArg<typeof Editor.isInline>
    isNormalizing: OmitFirstArg<typeof Editor.isNormalizing>
    isStart: OmitFirstArg<typeof Editor.isStart>
    isVoid: OmitFirstArg<typeof Editor.isVoid>
    last: OmitFirstArg<typeof Editor.last>
    leaf: OmitFirstArg<typeof Editor.leaf>
    levels: <T extends Node>(
      options?: EditorLevelsOptions<T>
    ) => Generator<NodeEntry<T>, void, undefined>
    next: <T extends Descendant>(
      options?: EditorNextOptions<T>
    ) => NodeEntry<T> | undefined
    node: OmitFirstArg<typeof Editor.node>
    nodes: <T extends Node>(
      options?: EditorNodesOptions<T>
    ) => Generator<NodeEntry<T>, void, undefined>
    parent: OmitFirstArg<typeof Editor.parent>
    path: OmitFirstArg<typeof Editor.path>
    pathRef: OmitFirstArg<typeof Editor.pathRef>
    pathRefs: OmitFirstArg<typeof Editor.pathRefs>
    point: OmitFirstArg<typeof Editor.point>
    pointRef: OmitFirstArg<typeof Editor.pointRef>
    pointRefs: OmitFirstArg<typeof Editor.pointRefs>
    positions: OmitFirstArg<typeof Editor.positions>
    previous: <T extends Node>(
      options?: EditorPreviousOptions<T>
    ) => NodeEntry<T> | undefined
    range: OmitFirstArg<typeof Editor.range>
    rangeRef: OmitFirstArg<typeof Editor.rangeRef>
    rangeRefs: OmitFirstArg<typeof Editor.rangeRefs>
    start: OmitFirstArg<typeof Editor.start>
    string: OmitFirstArg<typeof Editor.string>
    unhangRange: OmitFirstArg<typeof Editor.unhangRange>
    void: OmitFirstArg<typeof Editor.void>
  }
  ```

  Note:

  - None of these method implementations have changed.
  - **`getMarks`** is an exception, as there is already **`editor.marks`** that stores the current marks.
  - **`Transforms.insertText`** has not been moved to **`editor`** yet: there is already an **`editor.insertText`** method with extended behavior. This may change in a future release, but this release is trying to avoid any breaking changes.
  - **`editor.insertText`** has a new argument (third): **`options?: TextInsertTextOptions`** to match **`Transforms.insertText`**.

  Bug Fixes:

  - Moving JSDoc's to the interface type to allow IDEs access to the interface methods.

### Patch Changes

- [#5396](https://github.com/ianstormtaylor/slate/pull/5396) [`bc945eb1`](https://github.com/ianstormtaylor/slate/commit/bc945eb12c612ef2688869d256416c8e37e32c07) Thanks [@Moerphy](https://github.com/Moerphy)! - Correct core normalization that could cause wrong nodes to be removed

## 0.93.0

### Minor Changes

- [#5374](https://github.com/ianstormtaylor/slate/pull/5374) [`b52e08b0`](https://github.com/ianstormtaylor/slate/commit/b52e08b0eafdcf1c77439e282c9dc89a4c72fbf1) Thanks [@12joan](https://github.com/12joan)! - - Add `isSelectable` to `editor` (default true). A non-selectable element is skipped over when navigating using arrow keys.
  - Add `ignoreNonSelectable` to `Editor.nodes`, `Editor.positions`, `Editor.after` and `Editor.before` (default false)
  - `Transforms.move` ignores non-selectable elements

* [#5374](https://github.com/ianstormtaylor/slate/pull/5374) [`b52e08b0`](https://github.com/ianstormtaylor/slate/commit/b52e08b0eafdcf1c77439e282c9dc89a4c72fbf1) Thanks [@12joan](https://github.com/12joan)! - - Add `isElementReadOnly` to `editor`. A read-only element behaves much like a void with regard to selection and deletion, but renders its `children` the same as any other non-void node.

## 0.91.4

### Patch Changes

- [#5311](https://github.com/ianstormtaylor/slate/pull/5311) [`0ac72a62`](https://github.com/ianstormtaylor/slate/commit/0ac72a626c41a9e259dc945b408d09367eca4b3f) Thanks [@zbeyens](https://github.com/zbeyens)! - Fix #5295 regression. `editor.shouldNormalize` new option: `initialDirtyPathsLength: number`

## 0.91.3

### Patch Changes

- [#5295](https://github.com/ianstormtaylor/slate/pull/5295) [`84f811a7`](https://github.com/ianstormtaylor/slate/commit/84f811a79c9b76050cb3dbe424efca3192cc44c6) Thanks [@zbeyens](https://github.com/zbeyens)! - New `editor` method that can be overridden to control when the normalization should stop. Default behavior (unchanged) is to throw an error when it iterates over 42 times the dirty paths length.

  ```ts
  shouldNormalize: ({
    iteration,
    dirtyPaths,
    operation,
  }: {
    iteration: number
    dirtyPaths: Path[]
    operation?: Operation
  }) => boolean
  ```

  - `editor.onChange` signature change: `(options?: { operation?: Operation }) => void` where `operation` is triggering the function.
  - `editor.normalizeNode` signature change: `(entry: NodeEntry, options?: { operation?: Operation }) => void` where `operation` is triggering the function.
  - `EditorNormalizeOptions` new option `operation?: Operation` where `operation` is triggering the function.

## 0.91.1

### Patch Changes

- [#5251](https://github.com/ianstormtaylor/slate/pull/5251) [`6fa4b954`](https://github.com/ianstormtaylor/slate/commit/6fa4b954a5e4c67cff87d00b1253b2a838c0db94) Thanks [@YaoKaiLun](https://github.com/YaoKaiLun)! - Fix the cursor jump to an unexpected position after deleting in android

## 0.90.0

### Patch Changes

- [#5278](https://github.com/ianstormtaylor/slate/pull/5278) [`9c4097a2`](https://github.com/ianstormtaylor/slate/commit/9c4097a26fa92718e6f4fc1f984a70fb5af42ca2) Thanks [@kylemclean](https://github.com/kylemclean)! - Revert to using inline styles for default editor styles

## 0.88.1

### Patch Changes

- [#5235](https://github.com/ianstormtaylor/slate/pull/5235) [`36203b3f`](https://github.com/ianstormtaylor/slate/commit/36203b3f10fc1ee154923c7c75ce7912fec1e6f7) Thanks [@ppiotrowicz](https://github.com/ppiotrowicz)! - Fixed Editor.above method that always returned undefined with Point location

## 0.87.0

### Minor Changes

- [#5206](https://github.com/ianstormtaylor/slate/pull/5206) [`96b7fcdb`](https://github.com/ianstormtaylor/slate/commit/96b7fcdbf98a7c8908f5d9613d9898cb24a8ae47) Thanks [@kylemclean](https://github.com/kylemclean)! - Use stylesheet for default styles on Editable components

## 0.86.0

### Patch Changes

- [#5189](https://github.com/ianstormtaylor/slate/pull/5189) [`fbc9838f`](https://github.com/ianstormtaylor/slate/commit/fbc9838fd72e78bfa9af49013981939773dcca11) Thanks [@SmilinBrian](https://github.com/SmilinBrian)! - Add hanging option to unsetNodes so it matches setNodes

* [#5193](https://github.com/ianstormtaylor/slate/pull/5193) [`6909a8f7`](https://github.com/ianstormtaylor/slate/commit/6909a8f7da0f70b1ef3b5c3a665e8d0d09e6fa99) Thanks [@SmilinBrian](https://github.com/SmilinBrian)! - Stops Editor.unhangRange() from adjusting the range in some cases when it was not actually hanging

- [#5186](https://github.com/ianstormtaylor/slate/pull/5186) [`e416d00b`](https://github.com/ianstormtaylor/slate/commit/e416d00b6c95d05a1e10f738bfbbddd6cb940ab6) Thanks [@SmilinBrian](https://github.com/SmilinBrian)! - Report marks applied to a markableVoid if selection is collapsed

## 0.85.0

### Patch Changes

- [#5135](https://github.com/ianstormtaylor/slate/pull/5135) [`346f6572`](https://github.com/ianstormtaylor/slate/commit/346f6572fc8fdb6504bb18d8676f5bdeef7014eb) Thanks [@SmilinBrian](https://github.com/SmilinBrian)! - Allow void elements to receive marks via markableVoid()

* [#5168](https://github.com/ianstormtaylor/slate/pull/5168) [`3c49ff28`](https://github.com/ianstormtaylor/slate/commit/3c49ff28b3d188f69d8361bd682b7e8d0a1c13b6) Thanks [@i-artist](https://github.com/i-artist)! - Fixed above method that failed to get parentEntry when selection was range

## 0.84.0

### Minor Changes

- [#5137](https://github.com/ianstormtaylor/slate/pull/5137) [`a2184d86`](https://github.com/ianstormtaylor/slate/commit/a2184d86571cfd0d89beb67863c444a988174937) Thanks [@mainhanu](https://github.com/mainhanu)! - transform.delete and transform.insertFragment performance optimize

## 0.82.1

### Patch Changes

- [#5069](https://github.com/ianstormtaylor/slate/pull/5069) [`46d113fe`](https://github.com/ianstormtaylor/slate/commit/46d113fe1e102c87772681fdd90a086e37a3200d) Thanks [@krenzke](https://github.com/krenzke)! - Expose getDirtyPaths method on Editor object to allow for customization

## 0.82.0

### Patch Changes

- [#4988](https://github.com/ianstormtaylor/slate/pull/4988) [`fbab6331`](https://github.com/ianstormtaylor/slate/commit/fbab6331a5ecebd9e98c6c8c87d6f4b3b7c43bd0) Thanks [@BitPhinix](https://github.com/BitPhinix)! - Android input handling rewrite, replace composition insert prefixes with decoration based mark placeholders

## 0.81.3

### Patch Changes

- [#5042](https://github.com/ianstormtaylor/slate/pull/5042) [`11a93e65`](https://github.com/ianstormtaylor/slate/commit/11a93e65de4b197a43777e575caf13d7a05d5dc9) Thanks [@bryanph](https://github.com/bryanph)! - Upgrade next.js and source-map-loader packages

* [#5018](https://github.com/ianstormtaylor/slate/pull/5018) [`f13cd6b9`](https://github.com/ianstormtaylor/slate/commit/f13cd6b9180e18201b2a001b6f5d109218071319) Thanks [@ulion](https://github.com/ulion)! - Fix for insertFragment text/inline + block mixed fragments.

## 0.81.2

### Patch Changes

- [#5029](https://github.com/ianstormtaylor/slate/pull/5029) [`736662f8`](https://github.com/ianstormtaylor/slate/commit/736662f80838902f8560554fae704c13c5d8e227) Thanks [@hanagejet](https://github.com/hanagejet)! - fix: `Path.previous()` dose not working when path is `null`

## 0.81.1

### Patch Changes

- [#5015](https://github.com/ianstormtaylor/slate/pull/5015) [`9ae37287`](https://github.com/ianstormtaylor/slate/commit/9ae372875df1ee3ef6041f5d6bd2f57ee8291ea0) Thanks [@tithanayut](https://github.com/tithanayut)! - Fix deleteBackward behavior for Thai script where deleting N character(s) backward should delete
  N code point(s) instead of an entire grapheme cluster

## 0.81.0

### Minor Changes

- [#4999](https://github.com/ianstormtaylor/slate/pull/4999) [`fe13a8f9`](https://github.com/ianstormtaylor/slate/commit/fe13a8f9e750569342ee004951e34233ab6614bf) Thanks [@alexandercampbell](https://github.com/alexandercampbell)! - Add new Slate.Scrubber interface to allow scrubbing end user data from exception
  text. The default behavior remains unchanged.

## 0.80.0

### Minor Changes

- [#4892](https://github.com/ianstormtaylor/slate/pull/4892) [`d2fc25c3`](https://github.com/ianstormtaylor/slate/commit/d2fc25c3c31453597f59cd2ac6ba087a1beb1fe3) Thanks [@suilang](https://github.com/suilang)! - update insertText logic when selection is not collapsed

### Patch Changes

- [#5008](https://github.com/ianstormtaylor/slate/pull/5008) [`e9ea2815`](https://github.com/ianstormtaylor/slate/commit/e9ea2815950fc6b78fb0a2ba0e5d95c8553ac023) Thanks [@steve-codaio](https://github.com/steve-codaio)! - Revert to previous position behavior around inline voids

## 0.78.0

### Minor Changes

- [#4974](https://github.com/ianstormtaylor/slate/pull/4974) [`3b7a1bf7`](https://github.com/ianstormtaylor/slate/commit/3b7a1bf72d0c3951416c771f7f149bfbda411111) Thanks [@dylans](https://github.com/dylans)! - Added types for options and common string literals, thanks @JoshuaKGoldberg

## 0.77.2

### Patch Changes

- [#4952](https://github.com/ianstormtaylor/slate/pull/4952) [`9ce0a08c`](https://github.com/ianstormtaylor/slate/commit/9ce0a08c2a8b2b72df14141a06ca08825a66d472) Thanks [@steve-codaio](https://github.com/steve-codaio)! - Fix positions iteration when starting inside an inline void node

## 0.77.0

### Patch Changes

- [#4939](https://github.com/ianstormtaylor/slate/pull/4939) [`c39c8082`](https://github.com/ianstormtaylor/slate/commit/c39c8082a97dec8fc9ba64568d817ba87e348b48) Thanks [@ahoisl](https://github.com/ahoisl)! - Fix pointRef leaks caused by not unref'ing

## 0.76.1

### Patch Changes

- [#4914](https://github.com/ianstormtaylor/slate/pull/4914) [`aff67312`](https://github.com/ianstormtaylor/slate/commit/aff67312cbfa7e45df5cf6abcaec9f4f7d5f1a89) Thanks [@sennpang](https://github.com/sennpang)! - Fixed Triple click selection and copy&paste in read-only mode

## 0.76.0

### Minor Changes

- [#4873](https://github.com/ianstormtaylor/slate/pull/4873) [`20acca4b`](https://github.com/ianstormtaylor/slate/commit/20acca4bc8f31bd1aa6fbca2c49aaae5f31cadfe) Thanks [@bryanph](https://github.com/bryanph)! - A different behavior for inserting a soft break with shift+enter is quite common in rich text editors. Right now you have to do this in onKeyDown which is not so nice. This adds a separate insertSoftBreak method on the editor instance that gets called when a soft break is inserted. This maintains the current default behavior for backwards compatibility (it just splits the block). But at least you can easily overwrite it now.

  If you rely on overwriting editor.insertBreak for extra behavior for soft breaks this might be a breaking change for you and you should overwrite editor.insertSoftBreak instead.

### Patch Changes

- [#4912](https://github.com/ianstormtaylor/slate/pull/4912) [`43ca2b56`](https://github.com/ianstormtaylor/slate/commit/43ca2b56c8bd8bcc30dd38808dd191f804d53ae4) Thanks [@zhugexinxin](https://github.com/zhugexinxin)! - feat: add merge to setNodes and test

## 0.75.0

### Patch Changes

- [#4889](https://github.com/ianstormtaylor/slate/pull/4889) [`970523f`](https://github.com/ianstormtaylor/slate/commit/970523f881bf1918f91cb9de87c961dfb965e8a1)(https://github.com/ianstormtaylor/slate/commit/970523f881bf1918f91cb9de87c961dfb965e8a1) Thanks [@zhugexinxin](https://github.com/zhugexinxin)! - feat: add custom compare node props

## 0.73.1

### Patch Changes

- [#4858](https://github.com/ianstormtaylor/slate/pull/4858) [`33be22f3`](https://github.com/ianstormtaylor/slate/commit/33be22f3e3a0321ded199b13c0d97ae577c6b941) Thanks [@TheSpyder](https://github.com/TheSpyder)! - Reverted #4804 as it triggered an exception when inserting text with multi-block selection

## 0.73.0

### Minor Changes

- [#4848](https://github.com/ianstormtaylor/slate/pull/4848) [`482b090e`](https://github.com/ianstormtaylor/slate/commit/482b090e6f6f4c5fbc85e6dd2ea65387156ae8b5) Thanks [@rockettomatooo](https://github.com/rockettomatooo)! - fix point transform for insert_text operations to account for affinity

## 0.72.8

### Patch Changes

- [#4804](https://github.com/ianstormtaylor/slate/pull/4804) [`03861afc`](https://github.com/ianstormtaylor/slate/commit/03861afc62c3b27339d20151ca8a3e52f51ff973) Thanks [@suilang](https://github.com/suilang)! - update insertText logic when selection is not collapsed

## 0.72.3

### Patch Changes

- [#4703](https://github.com/ianstormtaylor/slate/pull/4703) [`205d4b7e`](https://github.com/ianstormtaylor/slate/commit/205d4b7e66b30ec911e8968a736593aaf2be1567) Thanks [@e1himself](https://github.com/e1himself)! - Add tests for Editor.unhangRange() behavior

## 0.72.2

### Patch Changes

- [#4729](https://github.com/ianstormtaylor/slate/pull/4729) [`ab62da20`](https://github.com/ianstormtaylor/slate/commit/ab62da2064921f534ce158f20cd853d2d904f6f6) Thanks [@ahoisl](https://github.com/ahoisl)! - chore: add vscode launch.json debug config

* [#4735](https://github.com/ianstormtaylor/slate/pull/4735) [`e5427ddd`](https://github.com/ianstormtaylor/slate/commit/e5427dddfc57b4362b7545e9971cdfb9b05d5c3d) Thanks [@steve-codaio](https://github.com/steve-codaio)! - Optimize path transforms during normalization

## 0.72.0

### Patch Changes

- [#4708](https://github.com/ianstormtaylor/slate/pull/4708) [`2fc7ad92`](https://github.com/ianstormtaylor/slate/commit/2fc7ad924cfbb75de59f685eeabb0375769201b9) Thanks [@bryanph](https://github.com/bryanph)! - Allow `Operation` type to be extended

  For example:

  ```
  import type { BaseOperation } from 'slate'

  type CustomOperation =
   | BaseOperation
   | YourCustomOperation
   | AnotherCustomOperation

  declare module 'slate' {
    interface CustomTypes {
      Operation: CustomOperation;
    }
  }
  ```

## 0.71.0

### Minor Changes

- [#4672](https://github.com/ianstormtaylor/slate/pull/4672) [`2523dc4f`](https://github.com/ianstormtaylor/slate/commit/2523dc4f6e7fee81baf77a67da4c3adaab921f15) Thanks [@VictorBaron](https://github.com/VictorBaron)! - Fix - deep-equals was always returning true when array props were equals.

### Patch Changes

- [#4671](https://github.com/ianstormtaylor/slate/pull/4671) [`e3afda94`](https://github.com/ianstormtaylor/slate/commit/e3afda946685795237f748e76c7bb051c09cb7fa) Thanks [@unageek](https://github.com/unageek)! - Fixed the issue where the cursor jumps more than one character unexpectedly

## 0.70.0

### Minor Changes

- [#4565](https://github.com/ianstormtaylor/slate/pull/4565) [`5818aca5`](https://github.com/ianstormtaylor/slate/commit/5818aca5038f38465a5769fe944f184be0255341) Thanks [@oliger](https://github.com/oliger)! - Fix issue with unicode 1.1 smileys followed by a variation selector.

### Patch Changes

- [#4638](https://github.com/ianstormtaylor/slate/pull/4638) [`e0f41514`](https://github.com/ianstormtaylor/slate/commit/e0f41514a1e0e866297904be16eff82702e8afd8) Thanks [@e1himself](https://github.com/e1himself)! - Improve typescript type of `props` argument of `Transforms.setNodes()`

## 0.67.1

### Patch Changes

- [#4578](https://github.com/ianstormtaylor/slate/pull/4578) [`67badb7d`](https://github.com/ianstormtaylor/slate/commit/67badb7dd03c6d36d31b90689247553c0386d771) Thanks [@jameshfisher](https://github.com/jameshfisher)! - Allow typing at the end of inline elements

## 0.66.5

### Patch Changes

- [#4552](https://github.com/ianstormtaylor/slate/pull/4552) [`37d60c58`](https://github.com/ianstormtaylor/slate/commit/37d60c58b8d4fb844f31888b518be6c2a01fb110) Thanks [@clauderic](https://github.com/clauderic)! - Only apply Firefox `toSlatePoint()` offset fix when the cloned contents end in `\n\n` instead of just `\n`.

## 0.66.2

### Patch Changes

- [#4523](https://github.com/ianstormtaylor/slate/pull/4523) [`0da12c17`](https://github.com/ianstormtaylor/slate/commit/0da12c17dc0484f065af2a270d352593a65c1577) Thanks [@steve-codaio](https://github.com/steve-codaio)! - Fix setNodes when called with 'split' and a collapsed range

## 0.66.1

### Patch Changes

- [#4518](https://github.com/ianstormtaylor/slate/pull/4518) [`6ec399d4`](https://github.com/ianstormtaylor/slate/commit/6ec399d4db60f1a8d59268c333b43a26dc518b79) Thanks [@TheSpyder](https://github.com/TheSpyder)! - Fixed flaw in deep-equal algorithm when dealing with nested mark objects

* [#4511](https://github.com/ianstormtaylor/slate/pull/4511) [`2af6868d`](https://github.com/ianstormtaylor/slate/commit/2af6868d41b8d797eebdcba5edb18638fe62fd45) Thanks [@dylans](https://github.com/dylans)! - update release process for yarn 3

- [#4516](https://github.com/ianstormtaylor/slate/pull/4516) [`59ca7a8f`](https://github.com/ianstormtaylor/slate/commit/59ca7a8f518c7735c89148ff1d9a8ae9dcf4297f) Thanks [@dylans](https://github.com/dylans)! - another attempt to get the automated changeset workflow working again

## 0.66.0

### Minor Changes

- [#4489](https://github.com/ianstormtaylor/slate/pull/4489) [`1b560de3`](https://github.com/ianstormtaylor/slate/commit/1b560de3e13d08cdc95d7f659a497ff0f07d296a) Thanks [@nemanja-tosic](https://github.com/nemanja-tosic)! - Fix paste to empty node losing structure of first block

* [#4326](https://github.com/ianstormtaylor/slate/pull/4326) [`00259003`](https://github.com/ianstormtaylor/slate/commit/0025900349b2c2ff92c044b97389969fa32a9200) Thanks [@oliger](https://github.com/oliger)! - Add support for [flag](https://emojipedia.org/emoji-flag-sequence/), [keycap](https://emojipedia.org/emoji-keycap-sequence/) and [tag](https://emojipedia.org/emoji-tag-sequence/) unicode sequences.

- [#4276](https://github.com/ianstormtaylor/slate/pull/4276) [`6f47cbbe`](https://github.com/ianstormtaylor/slate/commit/6f47cbbe0d8f320be8baf02a6e26d756d226cfca) Thanks [@TheSpyder](https://github.com/TheSpyder)! - Switched from `fast-deep-equal` to a custom deep equality check. This restores the ability for text nodes with mark values set to `undefined` to merge with text nodes missing those keys.

* [#4431](https://github.com/ianstormtaylor/slate/pull/4431) [`55ff8f00`](https://github.com/ianstormtaylor/slate/commit/55ff8f00e46e5fd0f2aef41da321c02b6d3a0f70) Thanks [@TheSpyder](https://github.com/TheSpyder)! - Fixed regression in #4208 where normalization on empty block nodes could not be overridden

- [#3820](https://github.com/ianstormtaylor/slate/pull/3820) [`c6203a2d`](https://github.com/ianstormtaylor/slate/commit/c6203a2d682325e550d4f4b9fc3ee3ca3429e466) Thanks [@githoniel](https://github.com/githoniel)! - unwrapNode call liftNode in reverse order to keep nested block

* [#4428](https://github.com/ianstormtaylor/slate/pull/4428) [`b47d3fd1`](https://github.com/ianstormtaylor/slate/commit/b47d3fd191c6b76585898ec9b8c490f15dcff2da) Thanks [@TheSpyder](https://github.com/TheSpyder)! - Don't set `null` in `set_node`'s `newProperties` object when using `Transforms.unsetNodes()`

### Patch Changes

- [#4132](https://github.com/ianstormtaylor/slate/pull/4132) [`48b71294`](https://github.com/ianstormtaylor/slate/commit/48b7129447347c9cf7a0535026287896ef59779b) Thanks [@ulion](https://github.com/ulion)! - Make onDomSelectionChange trigger after onClick.

* [#4500](https://github.com/ianstormtaylor/slate/pull/4500) [`50bb3d7e`](https://github.com/ianstormtaylor/slate/commit/50bb3d7e32d640957018831526235ca656963f1d) Thanks [@tubbo](https://github.com/tubbo)! - Upgrade `is-plain-object` to v5.0.0

- [#4482](https://github.com/ianstormtaylor/slate/pull/4482) [`dd752df1`](https://github.com/ianstormtaylor/slate/commit/dd752df11dc90da6bd6add88d1cfa6f00f03912b) Thanks [@Jokcy](https://github.com/Jokcy)! - Fix cursor not correct issue after insert multiple nodes with `Transform.insertNodes`

* [#4296](https://github.com/ianstormtaylor/slate/pull/4296) [`479a7591`](https://github.com/ianstormtaylor/slate/commit/479a759108bc0f903715e08d542307566b077227) Thanks [@kellyjosephprice](https://github.com/kellyjosephprice)! - Fix mergeNodes moving node into parent sibling

- [#4458](https://github.com/ianstormtaylor/slate/pull/4458) [`95c759a1`](https://github.com/ianstormtaylor/slate/commit/95c759a19c1e057bbc99148867298a73b014831d) Thanks [@taj-codaio](https://github.com/taj-codaio)! - Normalization now removes empty text nodes after nonempty nodes with differing styles, but before inline nodes.

* [#4505](https://github.com/ianstormtaylor/slate/pull/4505) [`269e59c9`](https://github.com/ianstormtaylor/slate/commit/269e59c93aea31cdb438e9cc07d34cec0e482798) Thanks [@dylans](https://github.com/dylans)! - Immer 9 security update, refactor to support immer 9 API changes

## 0.65.3

### Patch Changes

- [#4253](https://github.com/ianstormtaylor/slate/pull/4253) [`0214b630`](https://github.com/ianstormtaylor/slate/commit/0214b630778e7fa3b6ebcdf6cd9a8e4cf7351bd3) Thanks [@TheSpyder](https://github.com/TheSpyder)! - Fix `Transforms.wrapNodes` crashing when the `match` function matched only the editor

* [#4049](https://github.com/ianstormtaylor/slate/pull/4049) [`6c844227`](https://github.com/ianstormtaylor/slate/commit/6c8442272105ec78b88d38efecb7aab9bb4e41de) Thanks [@ulion](https://github.com/ulion)! - Fix ios chrome ime double input issue.

- [#4421](https://github.com/ianstormtaylor/slate/pull/4421) [`237edc6e`](https://github.com/ianstormtaylor/slate/commit/237edc6ea616c9171611e632e146872a245bdb0e) Thanks [@jaked](https://github.com/jaked)! - fix decorate bug (#4277) without adding extra layers of render tree

* [#4349](https://github.com/ianstormtaylor/slate/pull/4349) [`236754c4`](https://github.com/ianstormtaylor/slate/commit/236754c4d2811d50f8e116cfd5de8d7619553cd9) Thanks [@imdbsd](https://github.com/imdbsd)! - Add isElementType utility to Element interface

## 0.63.0

### Minor Changes

- [#4230](https://github.com/ianstormtaylor/slate/pull/4230) [`796389c7`](https://github.com/ianstormtaylor/slate/commit/796389c7d3d9cead1493abcba6c678cb9dfa979f) Thanks [@TheSpyder](https://github.com/TheSpyder)! - Applying invalid `insert_node` operations will now throw an exception for all invalid paths, not just invalid parent paths.

### Patch Changes

- [#4245](https://github.com/ianstormtaylor/slate/pull/4245) [`b33a531b`](https://github.com/ianstormtaylor/slate/commit/b33a531bd0395ecb23bd9fd1ac1cd1c3b31f92ca) Thanks [@JonasKruckenberg](https://github.com/JonasKruckenberg)! - Removed lodash dependecy to reduce bundled footprint

* [#4208](https://github.com/ianstormtaylor/slate/pull/4208) [`feb293aa`](https://github.com/ianstormtaylor/slate/commit/feb293aaa2c02fe3ad319bd021e66908ee770a6e) Thanks [@TheSpyder](https://github.com/TheSpyder)! - Fix `Error: Cannot get the start point in the node at path [...] because it has no start text node` caused by normalizing a document where some elements have no children

- [#4230](https://github.com/ianstormtaylor/slate/pull/4230) [`796389c7`](https://github.com/ianstormtaylor/slate/commit/796389c7d3d9cead1493abcba6c678cb9dfa979f) Thanks [@TheSpyder](https://github.com/TheSpyder)! - Exceptions in `editor.apply()` and `Editor.withoutNormalizing()` will no longer leave the editor in an invalid state

* [#4227](https://github.com/ianstormtaylor/slate/pull/4227) [`e6413d46`](https://github.com/ianstormtaylor/slate/commit/e6413d46256f6fc60549974242d3ff6ba61e2968) Thanks [@ulion](https://github.com/ulion)! - Fixed a bug that would allow multiple changes to be scheduled at the same time.

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
