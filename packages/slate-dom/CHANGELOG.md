# slate-dom

## 0.130.1

### Patch Changes

- [#6169](https://github.com/ianstormtaylor/slate/pull/6169) [`fa2fcd0`](https://github.com/ianstormtaylor/slate/commit/fa2fcd0c2fb120fa48d08fdef31ad66fce3fbdfa) Thanks [@dylans](https://github.com/dylans)! - Keep empty blocks as a `<br>` in copied HTML, so pasting into Word and other rich-text targets no longer drops empty lines.

## 0.130.0

### Patch Changes

- [#6159](https://github.com/ianstormtaylor/slate/pull/6159) [`6b7a233`](https://github.com/ianstormtaylor/slate/commit/6b7a233a26c36b7991ce5d4992a7e2479e5ec2b4) Thanks [@dylans](https://github.com/dylans)! - Copy node objects passed to `insertNodes` that are already in a document, or that were inserted before, so each position gets its own object. Reusing an object, such as a template node inserted twice, made two nodes share one key and one parent entry, which broke rendering, selection and `findPath`. A node's first insertion keeps its object identity.

## 0.129.0

### Minor Changes

- [#6009](https://github.com/ianstormtaylor/slate/pull/6009) [`e885f88`](https://github.com/ianstormtaylor/slate/commit/e885f884d503e74ac2c12330040cbbf87b3216d9) Thanks [@gbalint](https://github.com/gbalint)! - Add `DOMEditor.isMounted(editor)` to check whether the editor has a DOM element, and use it in `focus` and `hasDOMNode`. `hasDOMNode` now returns `false` for an editor that is not mounted, instead of throwing.

### Patch Changes

- [#6139](https://github.com/ianstormtaylor/slate/pull/6139) [`b15d7dc`](https://github.com/ianstormtaylor/slate/commit/b15d7dcee3cc6a24fb1c4c27e2a54f8caaeb1fc5) Thanks [@dylans](https://github.com/dylans)! - Keep the editor's selection when `DOMEditor.focus` is called with a void, such as a mention, selected. The DOM selection is now applied after focusing the editable, because Chromium resets a caret placed inside non-editable content when focus arrives afterwards.

- [#6136](https://github.com/ianstormtaylor/slate/pull/6136) [`96ceedb`](https://github.com/ianstormtaylor/slate/commit/96ceedb1a004e6b542277a26403c0eda46eb343c) Thanks [@dylans](https://github.com/dylans)! - Keep a forward DOM selection that ends inside a block void when converting it with `toSlateRange`, instead of unhanging it to the end of the previous block.

- [#6131](https://github.com/ianstormtaylor/slate/pull/6131) [`6c7c452`](https://github.com/ianstormtaylor/slate/commit/6c7c4522e144b9bac00427527076e8a38e6bce6d) Thanks [@dylans](https://github.com/dylans)! - Resolve drop positions inside shadow DOM. `findEventRange` passes the editor's shadow root to `caretPositionFromPoint` where the browser supports it, instead of resolving to the shadow host and throwing "Cannot resolve a Slate point from DOM point".

- [#6138](https://github.com/ianstormtaylor/slate/pull/6138) [`eb25ecd`](https://github.com/ianstormtaylor/slate/commit/eb25ecd984b9351477137b80b7f3e5ae93120035) Thanks [@dylans](https://github.com/dylans)! - Only read `data-slate-fragment` from an HTML attribute when pasting, so pasted text that happens to contain `data-slate-fragment="…"` no longer makes the paste fail.

## 0.128.1

### Patch Changes

- [#6055](https://github.com/ianstormtaylor/slate/pull/6055) [`4776b093`](https://github.com/ianstormtaylor/slate/commit/4776b093f61b1c47d2b7f42f4351d076baf0890d) Thanks [@ckale-scorpio](https://github.com/ckale-scorpio)! - Stop `deleteBackward('line')` from throwing when a line boundary cannot be measured against the DOM, such as when the editor's DOM is stale or not mounted. The line check now treats an unmeasurable range as being on a different line.

## 0.126.0

### Patch Changes

- [#6072](https://github.com/ianstormtaylor/slate/pull/6072) [`ea379934`](https://github.com/ianstormtaylor/slate/commit/ea379934d2155a3fc6ce67d8800a2e052fb8efcb) Thanks [@pangoyal-gong](https://github.com/pangoyal-gong)! - Fix `toSlatePoint` not respecting `suppressThrow` when `toSlateNode` throws. Only errors from `findPath` were guarded; errors from the preceding `toSlateNode` propagated unconditionally even with `suppressThrow: true`.

## 0.124.1

### Patch Changes

- [#6040](https://github.com/ianstormtaylor/slate/pull/6040) [`20a1a937`](https://github.com/ianstormtaylor/slate/commit/20a1a9371538dda1911d533e0f02b1655ffffa12) Thanks [@12joan](https://github.com/12joan)! - - Harden property accessors against untrusted keys
  - Fix incorrect argument types for the `compare` and `merge` options of `Transforms.setNodes`

## 0.124.0

### Patch Changes

- [#6019](https://github.com/ianstormtaylor/slate/pull/6019) [`b9794a97`](https://github.com/ianstormtaylor/slate/commit/b9794a97dd8141f0e09c7ebb37395197553be2f6) Thanks [@delijah](https://github.com/delijah)! - Fix text node lookup for toSlatePoint

## 0.123.1

### Patch Changes

- [#6004](https://github.com/ianstormtaylor/slate/pull/6004) [`e2a940a0`](https://github.com/ianstormtaylor/slate/commit/e2a940a0e1575a4f084923a16a1ab89cf965dfda) Thanks [@christianhg](https://github.com/christianhg)! - Fix `findPath` throwing "Unable to find the path for Slate node" after component unmount

  When `toSlatePoint` is called with `suppressThrow: true` (e.g., from `toSlateRange` during selection change handling), it should not throw errors. However, the internal `findPath` calls were not respecting this option, causing errors to be thrown when the component was unmounting and node references became stale.

  This fix wraps the `findPath` calls in `toSlatePoint` with try-catch blocks that respect the `suppressThrow` option, returning `null` instead of throwing when the option is enabled.

## 0.123.0

### Patch Changes

- [#6000](https://github.com/ianstormtaylor/slate/pull/6000) [`8d9bf305`](https://github.com/ianstormtaylor/slate/commit/8d9bf30595a6fad62ff15e302ab489ff46a2515a) Thanks [@nabbydude](https://github.com/nabbydude)! - Added `Location.isPath`, `Location.isPoint`, `Location.isRange`, and `Location.isSpan` functions, as efficient type discriminators.
  Use these instead of `Path.isPath`, `Point.isPoint`, `Range.isRange`, and `Span.isSpan` whenever possible.

## 0.121.0

### Patch Changes

- [#5982](https://github.com/ianstormtaylor/slate/pull/5982) [`dd4a77b3`](https://github.com/ianstormtaylor/slate/commit/dd4a77b3c5bb5d2d3cd6a62f49d6f318d30d6727) Thanks [@nabbydude](https://github.com/nabbydude)! - Add `Node.isEditor`, `Node.isElement`, and `Node.isText` as alternative type guards for when we already know the object is a node.
  Use these new functions instead of `Editor.isEditor`, `Element.isElement`, and `Text.isText` whenever possible, the classic functions are only necessary for typechecking an entirely unknown object.
  ===

## 0.119.0

### Minor Changes

- [#5963](https://github.com/ianstormtaylor/slate/pull/5963) [`33e74a82`](https://github.com/ianstormtaylor/slate/commit/33e74a822b82c4b9ce1444f456c5343970441ccb) Thanks [@iperzic](https://github.com/iperzic)! - Fixes an editor crash that happens when editor is placed inside Shadow DOM and the user is typing on Android

## 0.118.1

### Patch Changes

- [#5936](https://github.com/ianstormtaylor/slate/pull/5936) [`05583457`](https://github.com/ianstormtaylor/slate/commit/0558345703e3451f82ffd7eeb15dee51102b1209) Thanks [@delijah](https://github.com/delijah)! - Search backward and forward for leaf nodes in non contenteditable elements inside `toSlatePoint`

## 0.117.4

### Patch Changes

- [#5919](https://github.com/ianstormtaylor/slate/pull/5919) [`e029a87a`](https://github.com/ianstormtaylor/slate/commit/e029a87aba0d124af39c519813448201da32193d) Thanks [@12joan](https://github.com/12joan)! - Do not apply WeChat-related workarounds on recent versions of Chrome

- [#5916](https://github.com/ianstormtaylor/slate/pull/5916) [`f2ea1e1e`](https://github.com/ianstormtaylor/slate/commit/f2ea1e1e3ae281cfef145b92a9cb61c7a749363d) Thanks [@delijah](https://github.com/delijah)! - Do not retry focusing editor after it has been unmounted

## 0.116.0

### Minor Changes

- [#5871](https://github.com/ianstormtaylor/slate/pull/5871) [`fb87646e`](https://github.com/ianstormtaylor/slate/commit/fb87646e8643e1d0547134cea9d1f57912f06a92) Thanks [@12joan](https://github.com/12joan)! - - Add `splitDecorationsByChild` to split an array of decorated ranges by child index.

## 0.114.0

### Patch Changes

- [#5849](https://github.com/ianstormtaylor/slate/pull/5849) [`0fde537b`](https://github.com/ianstormtaylor/slate/commit/0fde537b52c23dd374721501e31e9aab56ce6477) Thanks [@12joan](https://github.com/12joan)! - Fix: Deleting backward by a line misses 1 character (belated changeset for https://github.com/ianstormtaylor/slate/pull/5827)

## 0.112.2

### Patch Changes

- [#5792](https://github.com/ianstormtaylor/slate/pull/5792) [`82165125`](https://github.com/ianstormtaylor/slate/commit/82165125957644f7dfe81d55a620f4d31132e3c9) Thanks [@zhi-zhi-zhi](https://github.com/zhi-zhi-zhi)! - fix: additional fix for previous fix: Prevent ReactEditor.toDOMRange crash in setDomSelection #5741

## 0.111.0

### Minor Changes

- [#5734](https://github.com/ianstormtaylor/slate/pull/5734) [`9a212512`](https://github.com/ianstormtaylor/slate/commit/9a2125127064f35332d5c06df2dfa3768f745185) Thanks [@bmingles](https://github.com/bmingles)! - Split out slate-dom package
