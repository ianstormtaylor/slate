# slate-react

## 0.62.0

### Minor Changes

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - **Add directional awareness to `Editor.deleteFragment`.** This is an obscure change, but is a required distinction when implementing features that need to "fake delete" content (like Google Docs's suggestions). Previously deleting always collapsed to the end of a range, but now it can collapse forwards as well.

## 0.61.1 (2021-03-29)

- [`d5589279`](https://github.com/ianstormtaylor/slate/commit/d5589279e8792185c1082af720a73f55b16797dd) - Updated placeholder styles to allow for wrapping long placeholder text.

* [#3698](https://github.com/ianstormtaylor/slate/pull/3698) [`bf83f333`](https://github.com/ianstormtaylor/slate/commit/bf83f333e689bc17b96504b497bb7fcdf6dc7fc1) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Fixed selection updating with IME inputs in browsers that support `beforeinput`.

- [#3652](https://github.com/ianstormtaylor/slate/pull/3652) [`f3fb40cc`](https://github.com/ianstormtaylor/slate/commit/f3fb40cce044b73b6da13013f90bd7018f2f5d8a) Thanks [@Andarist](https://github.com/Andarist)! - Fixed selection logic when a controlled editor's nodes change out from under it.

* [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed a bug where memoization logic would prevent placeholders from re-rendering properly.

- [#3326](https://github.com/ianstormtaylor/slate/pull/3326) [`d5b2d7f5`](https://github.com/ianstormtaylor/slate/commit/d5b2d7f55e2982019b246fdea1e9eb845d0e2fc2) Thanks [@rockettomatooo](https://github.com/rockettomatooo)! - Added invariants when passing invalud `value` or `editor` props to `<Editable>`.

* [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed cursor movement in RTL text.

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed a bug in the conversion of DOM points to Slate points.

* [#3746](https://github.com/ianstormtaylor/slate/pull/3746) [`f8be509e`](https://github.com/ianstormtaylor/slate/commit/f8be509e4d0b5c13bb791e0fd5702242319d114f) Thanks [@gztomas](https://github.com/gztomas)! - Fixed auto-scrolling behavior when a block is bigger than the viewport.

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed a bug that occurred when using Babel's `loose` mode.

* [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed deleting void elements when using cut-and-paste.

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed a bug that crashed the editor when using IME input.

* [#3396](https://github.com/ianstormtaylor/slate/pull/3396) [`469e6b26`](https://github.com/ianstormtaylor/slate/commit/469e6b26f50857ef0d68cdf5a54793f8fe9033fd) Thanks [@cvlmtg](https://github.com/cvlmtg)! - Fixed allowing the `onPaste` handler to be overridden in all browsers.

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed internal decoration logic to be faster and require fewer re-renders.

* [#3894](https://github.com/ianstormtaylor/slate/pull/3894) [`7fe41f15`](https://github.com/ianstormtaylor/slate/commit/7fe41f156614453479cb9ea649fe5665b616d3a7) Thanks [@msc117](https://github.com/msc117)! - Fixed an error that happened when selecting void nodes in a read-only editor.

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed `move_node` operations to not always require a full re-render.

* [`d5589279`](https://github.com/ianstormtaylor/slate/commit/d5589279e8792185c1082af720a73f55b16797dd) - Fixed normalization of DOM points to be more accurate when triple-clicking.

- [`d5589279`](https://github.com/ianstormtaylor/slate/commit/d5589279e8792185c1082af720a73f55b16797dd) - Fixed a bug that prevented `isFocused` from updating on certain focus changes.

* [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed IME input to not insert repeated characters.

- [#3749](https://github.com/ianstormtaylor/slate/pull/3749) [`0473d0bf`](https://github.com/ianstormtaylor/slate/commit/0473d0bf93808b0e4e98abe833b7f7f4f5aff3b1) Thanks [@davidruisinger](https://github.com/davidruisinger)! - Fixes Slate to work with the Shadow DOM.

* [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed deleting by line to account for the line breaks in the browser.
