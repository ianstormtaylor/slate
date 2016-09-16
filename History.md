
This document maintains a list of changes to Slate with each new version. Until `1.0.0` is released, breaking changes will be added as minor version bumps, and non-breaking changes won't be accounted for since the library is moving quickly.


---


### `0.14.0` — September 10, 2016

###### BREAKING CHANGES

- **The `undo` and `redo` transforms need to be applied!** Previously, `undo` and `redo` were special cased such that they did not require an `.apply()` call, and instead would return a new `State` directly. Now this is no longer the case, and they are just like every other transform.

- **Transforms are no longer exposed on `State` or `Node`.** The transforms API has been completely refactored to be built up of "operations" for collaborative editing support. As part of this refactor, the transforms are now only available via the `state.transform()` API, and aren't exposed on the `State` or `Node` objects as they were before.

- **`Transform` objects are now mutable.** Previously `Transform` was an Immutable.js `Record`, but now it is a simple constructor. This is because transforms are inherently mutating their representation of a state, but this decision is [up for discussion](https://github.com/ianstormtaylor/slate/issues/328).

- **The selection can now be "unset".** Previously, a selection could never be in an "unset" state where the `anchorKey` or `focusKey` was null. This is no longer technically true, although this shouldn't really affect anyone in practice.


---


### `0.13.0` — August 15, 2016

###### BREAKING CHANGES

- **The `renderNode` and `renderMark` properties are gone!** Previously, rendering nodes and marks happened via these two properties of the `<Editor>`, but this has been replaced by the new `schema` property. Check out the updated examples to see how to define a schema! There's a good chance this eliminates extra code for most use cases! :smile:

- **The `renderDecorations` property is gone!** Decoration rendering has also been replaced by the new `schema` property of the `<Editor>`.


---


### `0.12.0` — August 9, 2016

###### BREAKING CHANGES

- **The `data.files` property is now an `Array`.** Previously it was a native `FileList` object, but needed to be changed to add full support for pasting an dropping files in all browsers. This shouldn't affect you unless you were specifically depending on it being array-like instead of a true `Array`.


---


### `0.11.0` — August 4, 2016

###### BREAKING CHANGES

- **Void nodes are renderered implicitly again!** Previously Slate had required that you wrap void node renderers yourself with the exposed `<Void>` wrapping component. This was to allow for selection styling, but a change was made to make selection styling able to handled in Javascript. Now the `<Void>` wrapper will be implicitly rendered by Slate, so you do not need to worry about it, and "voidness" only needs to toggled in one place, the `isVoid: true` property of a node.


---


### `0.10.0` — July 29, 2016

###### BREAKING CHANGES

- **Marks are now renderable as components.** Previously the only supported way to render marks was by returning a `style` object. Now you can return a style object, a class name string, or a full React component. Because of this, the DOM will be renderered slightly differently than before, resulting in an extra `<span>` when rendering non-component marks. This won't affect you unless you were depending on the DOM output by Slate for some reason.


---


### `0.9.0` — July 28, 2016

###### BREAKING CHANGES

- **The `wrap` and `unwrap` method signatures have changed!** Previously, you would pass `type` and `data` as separate parameters, for example: `wrapBlock('code', { src: true })`. This was inconsistent with other transforms, and has been updated such that a single argument of `properties` is passed instead. So that example could now be: `wrapBlock({ type: 'code', { data: { src: true }})`. You can still pass a `type` string as shorthand, which will be the most frequent use case, for example: `wrapBlock('code')`.


---


### `0.8.0` — July 27, 2016

###### BREAKING CHANGES

- **The `onKeyDown` and `onBeforeInput` handlers signatures have changed!** Previously, some Slate handlers had a signature of `(e, state, editor)` and others had a signature of `(e, data, state, editor)`. Now all handlers will be passed a `data` object—which contains Slate-specific data related to the event—even if it is empty. This is helpful for future compatibility where we might need to add data to a handler that previously didn't have any, and is nicer for consistency. The `onKeyDown` handler's new `data` object contains the `key` name, `code` and a series of `is*` properties to make working with hotkeys easier. The `onBeforeInput` handler's new `data` object is empty.

- **The `Utils` export has been removed.** Previously, a `Key` utility and the `findDOMNode` utility were exposed under the `Utils` object. The `Key` has been removed in favor of the `data` object passed to `onKeyDown`. And then `findDOMNode` utility has been upgraded to a top-level named export, so you'll now need to access it via `import { findDOMNode } from 'slate'`.

- **Void nodes now permanently have `" "` as content.** Previously, they contained an empty string, but this isn't technically correct, since they have content and shouldn't be considered "empty". Now they will have a single space of content. This shouldn't really affect anyone, unless you happened to be accessing that string for serialization.

- **Empty inline nodes are now impossible.** This is to stay consistent with native `contenteditable` behavior, where although technically the elements can exist, they have odd behavior and can never be selected.


---


### `0.7.0` — July 24, 2016

###### BREAKING CHANGES

- **The `Raw` serializer is no longer terse by default!** Previously, the `Raw` serializer would return a "terse" representation of the document, omitting information that wasn't _strictly_ necessary to deserialize later, like the `key` of nodes. By default this no longer happens. You have to opt-in to the behavior by passing `{ terse: true }` as the second `options` argument of the `deserialize` and `serialize` methods.


---


### `0.6.0` — July 22, 2016

###### BREAKING CHANGES

- **Void components are no longer rendered implicity!** Previously, Slate would automatically wrap any node with `isVoid: true` in a `<Void>` component. But doing this prevented you from customizing the wrapper, like adding a `className` or `style` property. So you **must now render the wrapper yourself**, and it has been exported as `Slate.Void`. This, combined with a small change to the `<Void>` component's structure allows the "selected" state of void nodes to be rendered purely with CSS based on the `:focus` property of a `<Void>` element, which previously [had to be handled in Javascript](https://github.com/ianstormtaylor/slate/commit/31782cb11a272466b6b9f1e4d6cc0c698504d97f). This allows us to streamline selection-handling logic, improving performance and reducing complexity.

- **`data-offset-key` is now `<key>-<index>` instead of `<key>:<start>-<end>`.** This shouldn't actually affect anyone, unless you were specifically relying on that attribute in the DOM. This change greatly reduces the number of re-renders needed, since previously any additional characters would cause a cascading change in the `<start>` and `<end>` offsets of latter text ranges.


---


### `0.5.0` — July 20, 2016

###### BREAKING CHANGES

- **`node.getTextNodes()` is now `node.getTexts()`.** This is just for consistency with the other existing `Node` methods like `getBlocks()`, `getInlines()`, etc. And it's nicely shorter. :wink:

- **`Node` methods now `throw` earlier during unexpected states.** This shouldn't break anything for most folks, unless a strange edge-case was going undetected previously.


---


### `0.4.0` — July 20, 2016

###### BREAKING CHANGES

- **`renderMark(mark, state, editor)` is now `renderMark(mark, marks, state, editor)`.** This change allows you to render marks based on multiple `marks` presence at once on a given range of text, for example using a custom `BoldItalic.otf` font when text has both `bold` and `italic` marks.


---


### `0.3.0` — July 20, 2016

###### BREAKING CHANGES

- **`transform.unwrapBlock()` now unwraps selectively.** Previously, calling `unwrapBlock` with a range representing a middle sibling would unwrap _all_ of the siblings, removing the wrapping block entirely. Now, calling it with those same arguments will only move the middle sibling up a layer in the hierarchy, preserving the nesting on any of its siblings. This changes makes it much simpler to implement functionality like unwrapping a single list item, which previously would unwrap the entire list.


---


### `0.2.0` — July 18, 2016

###### BREAKING CHANGES

- **`transform.mark()` is now `transform.addMark()` and `transform.unmark()` is now `transform.removeMark()`.** The new names make it clearer that the transforms are actions being performed, and it paves the way for adding a `toggleMark` convenience as well.


---


### `0.1.0` — July 13, 2016

:tada:

