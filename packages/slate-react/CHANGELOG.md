# slate-react

## 0.65.2

### Patch Changes

- [#4331](https://github.com/ianstormtaylor/slate/pull/4331) [`a3bc97af`](https://github.com/ianstormtaylor/slate/commit/a3bc97af3e3bc88ccf9ab7eadb1a56c0bc92f436) Thanks [@golota60](https://github.com/golota60)! - Fix deletion of selected inline void nodes in Safari when presssing `backspace` or `delete`. This is a bug that [was originally fixed only for Google Chrome](https://github.com/ianstormtaylor/slate/issues/3456), but the fix also needs to be applied in Safari.

## 0.65.1

### Patch Changes

- [#4324](https://github.com/ianstormtaylor/slate/pull/4324) [`61171a23`](https://github.com/ianstormtaylor/slate/commit/61171a23821b882116deabceec15f7e2649d271c) Thanks [@clauderic](https://github.com/clauderic)! - Fix backward typing bug in Safari by ensuring the selection is always removed on blur.
  Safari doesn't always remove the selection, even if the contenteditable element no longer has focus.
  In this scenario, we need to forcefully remove the selection on blur.
  Refer to https://stackoverflow.com/questions/12353247/force-contenteditable-div-to-stop-accepting-input-after-it-loses-focus-under-web

## 0.65.0

### Minor Changes

- [#4299](https://github.com/ianstormtaylor/slate/pull/4299) [`2c17e2b7`](https://github.com/ianstormtaylor/slate/commit/2c17e2b7f9dbfa4a821b05668bd00f465da175ad) Thanks [@georgberecz](https://github.com/georgberecz)! - Allow custom event handlers on Editable component to return boolean flag to specify whether the event can be treated as being handled.

  By default, the `Editable` component comes with a set of event handlers that handle typical rich-text editing behaviors (for example, it implements its own `onCopy`, `onPaste`, `onDrop`, and `onKeyDown` handlers).

  In some cases you may want to extend or override Slate's default behavior, which can be done by passing your own event handler(s) to the `Editable` component.

  Your custom event handler can control whether or not Slate should execute its own event handling for a given event after your handler runs depending on the return value of your event handler as described below.

  ```jsx
  import {Editable} from 'slate-react';

  function MyEditor() {
    const onClick = event => {
      // Implement custom event logic...

      // When no value is returned, Slate will execute its own event handler when
      // neither isDefaultPrevented nor isPropagationStopped was set on the event
    };

    const onDrop = event => {
      // Implement custom event logic...

      // No matter the state of the event, treat it as being handled by returning
      // true here, Slate will skip its own event handler
      return true;
    };

    const onDragStart = event => {
      // Implement custom event logic...

      // No matter the status of the event, treat event as *not* being handled by
      // returning false, Slate will exectue its own event handler afterward
      return false;
    };

    return (
      <Editable
        onClick={onClick}
        onDrop={onDrop}
        onDragStart={onDragStart}
        {/*...*/}
      />
    )
  }
  ```

### Patch Changes

- [#4266](https://github.com/ianstormtaylor/slate/pull/4266) [`411e5a19`](https://github.com/ianstormtaylor/slate/commit/411e5a193bd639fb743c2253a5f5e43a5949b100) Thanks [@TheSpyder](https://github.com/TheSpyder)! - Removed accidental bundling of `slate-history` inside `slate-react`

* [#4307](https://github.com/ianstormtaylor/slate/pull/4307) [`a7e3a181`](https://github.com/ianstormtaylor/slate/commit/a7e3a18187d1c29744d78875542abd035220ebdc) Thanks [@clauderic](https://github.com/clauderic)! - Fix deletion of selected inline void nodes in Chrome. Chrome does not fire a `beforeinput` event when deleting backwards within an inline void node, so we need to add special logic to handle this edge-case for Chrome only.

- [#4272](https://github.com/ianstormtaylor/slate/pull/4272) [`294d5120`](https://github.com/ianstormtaylor/slate/commit/294d5120aed89f4e1c7a818e0d1339f4fa1cbaf5) Thanks [@clauderic](https://github.com/clauderic)! - Fix errors accessing `globalThis` in browsers that do not implement it

* [#4295](https://github.com/ianstormtaylor/slate/pull/4295) [`dfc03960`](https://github.com/ianstormtaylor/slate/commit/dfc039601f7b4d74592dfe39c31b67c0f0619bca) Thanks [@dubzzz](https://github.com/dubzzz)! - Fix React warnings related to `autoCorrect` and `autoCapitalize` attributes being passed as a boolean instead of a string.

- [#4271](https://github.com/ianstormtaylor/slate/pull/4271) [`ff267767`](https://github.com/ianstormtaylor/slate/commit/ff267767f61577fdbd68119a1c978e9856e3bb31) Thanks [@omerg](https://github.com/omerg)! - Fixed typo: Renamed `toSlatePoint` argument `extractMatch` to `exactMatch`

## 0.64.0

### Minor Changes

- [#4257](https://github.com/ianstormtaylor/slate/pull/4257) [`4f0d1120`](https://github.com/ianstormtaylor/slate/commit/4f0d1120d46d1024d94e3c2742026f6c54357e1f) Thanks [@clauderic](https://github.com/clauderic)! - Added support for Android devices using a `MutationObserver` based reconciliation layer.

  Bugs should be expected; translating mutations into a set of operations that need to be reconciled onto the Slate model is not an absolute science, and requires a lot of guesswork and handling of edge cases. There are still edge cases that aren't being handled.

  This reconciliation layer aims to support Android 10 and 11. Earlier versions of Android work to a certain extent, but have more bugs and edge cases that currently aren't well supported.

## 0.63.0

### Patch Changes

- [#4238](https://github.com/ianstormtaylor/slate/pull/4238) [`c14e1fbc`](https://github.com/ianstormtaylor/slate/commit/c14e1fbc77c51f7928ba8ab089c76f3e3438fb97) Thanks [@clauderic](https://github.com/clauderic)! - Fix duplicated content and other bugs related to drag and drop handling

* [#4237](https://github.com/ianstormtaylor/slate/pull/4237) [`623960a7`](https://github.com/ianstormtaylor/slate/commit/623960a7d14103b8cebe667019b4de5f8ad1fd61) Thanks [@dylans](https://github.com/dylans)! - Fixed text insertion logic to prevent crashing in newer Firefox versions.

## 0.62.1

### Patch Changes

- [#4118](https://github.com/ianstormtaylor/slate/pull/4118) [`6a137633`](https://github.com/ianstormtaylor/slate/commit/6a1376332bbd2567336c444c57c1e64fdf706feb) Thanks [@kamilkazmierczak](https://github.com/kamilkazmierczak)! - Improved detection of legacy browsers that don't have proper `beforeinput` support.

* [#4190](https://github.com/ianstormtaylor/slate/pull/4190) [`ea2eefef`](https://github.com/ianstormtaylor/slate/commit/ea2eefefb84365eb969e91151afc861e0dbefefd) Thanks [@juliankrispel](https://github.com/juliankrispel)! - Added a `renderPlaceholder` prop to the `<Editable>` component for customizing how placeholders are rendered.

- [#4157](https://github.com/ianstormtaylor/slate/pull/4157) [`de5cc7e5`](https://github.com/ianstormtaylor/slate/commit/de5cc7e5ed97fdca9e3766a8d947ab6391e6ccb2) Thanks [@githoniel](https://github.com/githoniel)! - Fixed a bug when syncing the selection for IME-based editing.

* [#4158](https://github.com/ianstormtaylor/slate/pull/4158) [`ea6dc089`](https://github.com/ianstormtaylor/slate/commit/ea6dc08913d9dd671eeb05796dca522a4a35904e) Thanks [@githoniel](https://github.com/githoniel)! - Fixed a bug that resulted in doubly-input characters when using an IME.

- [#4211](https://github.com/ianstormtaylor/slate/pull/4211) [`1c32b97d`](https://github.com/ianstormtaylor/slate/commit/1c32b97d23138d301e9ecb567263e3001cc4dbfa) Thanks [@clauderic](https://github.com/clauderic)! - Collapse expanded selection before handling `moveWordBackward` (`alt + left`) and `moveWordForward` (`alt + right`) hotkeys.

* [#4219](https://github.com/ianstormtaylor/slate/pull/4219) [`737aaa9c`](https://github.com/ianstormtaylor/slate/commit/737aaa9cde2d4a2d6d64b83256aa5d9d1b5ce720) Thanks [@juliankrispel](https://github.com/juliankrispel)! - Fixes error that occurs when Editor is rendered inside iframe

## 0.62.0

### Minor Changes

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - **Add directional awareness to `Editor.deleteFragment`.** This is an obscure change, but is a required distinction when implementing features that need to "fake delete" content (like Google Docs's suggestions). Previously deleting always collapsed to the end of a range, but now it can collapse forwards as well.

* [#4154](https://github.com/ianstormtaylor/slate/pull/4154) [`7283c51f`](https://github.com/ianstormtaylor/slate/commit/7283c51feb83cb8522bc16efce09bb01c29400b9) Thanks [@ianstormtaylor](https://github.com/ianstormtaylor)! - **Start using [🦋 Changesets](https://github.com/atlassian/changesets) to manage releases.** Going forward, whenever a pull request is made that fixes or adds functionality to Slate, it will need to be accompanied by a changset Markdown file describing the change. These files will be automatically used in the release process when bump the versions of Slate and compiling the changelog.

### Patch Changes

- [#4150](https://github.com/ianstormtaylor/slate/pull/4150) [`bbd7d9c3`](https://github.com/ianstormtaylor/slate/commit/bbd7d9c33023add223ef9f1a33b657a468552caf) Thanks [@nivekithan](https://github.com/nivekithan)! - Added support for using the new `beforeInput` events in the latest Firefox.

* [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed spellcheck disabling logic to always work in older versions of Firefox.

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed browser-detection behavior to work with Deno.

* [`d5589279`](https://github.com/ianstormtaylor/slate/commit/d5589279e8792185c1082af720a73f55b16797dd) - Updated placeholder styles to allow for wrapping long placeholder text.

- [#3698](https://github.com/ianstormtaylor/slate/pull/3698) [`bf83f333`](https://github.com/ianstormtaylor/slate/commit/bf83f333e689bc17b96504b497bb7fcdf6dc7fc1) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Fixed selection updating with IME inputs in browsers that support `beforeinput`.

* [#3652](https://github.com/ianstormtaylor/slate/pull/3652) [`f3fb40cc`](https://github.com/ianstormtaylor/slate/commit/f3fb40cce044b73b6da13013f90bd7018f2f5d8a) Thanks [@Andarist](https://github.com/Andarist)! - Fixed selection logic when a controlled editor's nodes change out from under it.

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed a bug where memoization logic would prevent placeholders from re-rendering properly.

* [#3326](https://github.com/ianstormtaylor/slate/pull/3326) [`d5b2d7f5`](https://github.com/ianstormtaylor/slate/commit/d5b2d7f55e2982019b246fdea1e9eb845d0e2fc2) Thanks [@rockettomatooo](https://github.com/rockettomatooo)! - Added invariants when passing invalud `value` or `editor` props to `<Editable>`.

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed cursor movement in RTL text.

* [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed a bug in the conversion of DOM points to Slate points.

- [#3746](https://github.com/ianstormtaylor/slate/pull/3746) [`f8be509e`](https://github.com/ianstormtaylor/slate/commit/f8be509e4d0b5c13bb791e0fd5702242319d114f) Thanks [@gztomas](https://github.com/gztomas)! - Fixed auto-scrolling behavior when a block is bigger than the viewport.

* [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed a bug that occurred when using Babel's `loose` mode.

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed deleting void elements when using cut-and-paste.

* [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed a bug that crashed the editor when using IME input.

- [#3396](https://github.com/ianstormtaylor/slate/pull/3396) [`469e6b26`](https://github.com/ianstormtaylor/slate/commit/469e6b26f50857ef0d68cdf5a54793f8fe9033fd) Thanks [@cvlmtg](https://github.com/cvlmtg)! - Fixed allowing the `onPaste` handler to be overridden in all browsers.

* [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed internal decoration logic to be faster and require fewer re-renders.

- [#3894](https://github.com/ianstormtaylor/slate/pull/3894) [`7fe41f15`](https://github.com/ianstormtaylor/slate/commit/7fe41f156614453479cb9ea649fe5665b616d3a7) Thanks [@msc117](https://github.com/msc117)! - Fixed an error that happened when selecting void nodes in a read-only editor.

* [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed `move_node` operations to not always require a full re-render.

- [`d5589279`](https://github.com/ianstormtaylor/slate/commit/d5589279e8792185c1082af720a73f55b16797dd) - Fixed normalization of DOM points to be more accurate when triple-clicking.

* [`d5589279`](https://github.com/ianstormtaylor/slate/commit/d5589279e8792185c1082af720a73f55b16797dd) - Fixed a bug that prevented `isFocused` from updating on certain focus changes.

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed IME input to not insert repeated characters.

* [#3749](https://github.com/ianstormtaylor/slate/pull/3749) [`0473d0bf`](https://github.com/ianstormtaylor/slate/commit/0473d0bf93808b0e4e98abe833b7f7f4f5aff3b1) Thanks [@davidruisinger](https://github.com/davidruisinger)! - Fixes Slate to work with the Shadow DOM.

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed deleting by line to account for the line breaks in the browser.
