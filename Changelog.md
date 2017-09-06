
# Changelog

This document maintains a list of changes to Slate with each new version. Until `1.0.0` is released, breaking changes will be added as minor version bumps, and non-breaking changes won't be accounted for since the library is moving quickly.


---


### `0.22.0` — September 5, 2017

###### BREAKING CHANGES

- **The `Plain` serializer now adds line breaks between blocks.** Previously between blocks the text would be joined without any space whatsoever, but this wasn't really that useful or what you'd expect.

- **The `toggleMark` transform now checks the intersection of marks.** Previously, toggling would remove the mark from the range if any of the characters in a range didn't have it. However, this wasn't what all other rich-text editors did, so the behavior has changed to mimic the standard behavior. Now, if any characters in the selection have the mark applied, it will first be added when toggling.

- **The `.length` property of nodes has been removed.** This property caused issues with code like in Lodash that checked for "array-likeness" by simply looking for a `.length` property that was a number.

- **`onChange` now receives a `Change` object (previously named `Transform`) instead of a `State`.** This is needed because it enforces that all changes are represented by a single set of operations. Otherwise right now it's possible to do things like `state.transform()....apply({ save: false }).transform()....apply()` and result in losing the operation information in the history. With OT, we need all transforms that may happen to be exposed and emitted by the editor. The new syntax looks like:

```js
onChange(change) {
  this.setState({ state: change.state })
}

onChange({ state }) {
  this.setState({ state })
}
```

- **Similarly, handlers now receive `e, data, change` instead of `e, data, state`.** Instead of doing `return state.transform()....apply()` the plugins can now act on the change object directly. Plugins can still `return change...` if they want to break the stack from continuing on to other plugins. (Any `!= null` value will break out.) But they can also now not return anything, and the stack will apply their changes and continue onwards. This was previously impossible. The new syntax looks like:

```js
function onKeyDown(e, data, change) {
  if (data.key == 'enter') {
    return change.splitBlock()
  }
}
```

- **The `onChange` and `on[Before]Change` handlers now receive `Change` objects.** Previously they would also receive a `state` object, but now they receive `change` objects like the rest of the plugin API.

- **The `.apply({ save })` option is now `state.change({ save })` instead.** This is the easiest way to use it, but requires that you know whether to save or not up front. If you want to use it inline after already saving some changes, you can use the `change.setOperationFlag('save', true)` flag instead. This shouldn't be necessary for 99% of use cases though.

- **The `.undo()` and `.redo()` transforms don't save by default.** Previously you had to specifically tell these transforms not to save into the history, which was awkward. Now they won't save the operations they're undoing/redoing by default.

- **`onBeforeChange` is no longer called from `componentWillReceiveProps`,** when a new `state` is passed in as props to the `<Editor>` component. This caused lots of state-management issues and was weird in the first place because passing in props would result in changes firing. **It is now the parent component's responsibility to not pass in improperly formatted `State` objects**.

- **The `splitNodeByKey` change method has changed to be shallow.** Previously, it would deeply split to an offset. But now it is shallow and another `splitDescendantsByKey` change method has been added (with a different signature) for the deep splitting behavior. This is needed because splitting and joining operations have been changed to all be shallow, which is required so that operational transforms can be written against them.

- **The shape of many operations has changed.** This was needed to make operations completely invertible without any extra context. The operations were never really exposed in a consumable way, so I won't detail all of the changes here, but feel free to look at the source to see the details.

- **All references to "joining" nodes is now called "merging".** This is to be slightly clearer, since merging can only happen with adjacent nodes already, and to have a nicer parallel with "splitting", as in cells. The operation is now called `merge_node`, and the transforms are now `merge*`.

###### DEPRECATION CHANGES

- **The `transform.apply()` method is deprecated.** Previously this is where the saving into the history would happen, but it created an awkward convention that wasn't necessary. Now operations are saved into the history as they are created with change methods, instead of waiting until the end. You can access the new `State` of a change at any time via `change.state`.


---


### `0.21.0` — July 20, 2017

###### BREAKING CHANGES

- **The `Html` serializer now uses `DOMParser` instead of `cheerio`.** Previously, the `Html` serializer used the `cheerio` library for representing elements in the serialization rule logic, but cheerio was a very large dependency. It has been removed, and the native browser `DOMParser` is now used instead. All HTML serialization rules will need to be updated. If you are working with Slate on the server, you can now pass in a custom serializer to the `Html` constructor, using the `parse5` library.


---


### `0.20.0` — May 17, 2017

###### BREAKING CHANGES

- **Returning `null` from the `Html` serializer skips the element.** Previously, `null` and `undefined` had the same behavior of skipping the rule and trying the rest of the rules. Now if you explicitly return `null` it will skip the element itself.


---


### `0.19.0` — March 3, 2017

###### BREAKING CHANGES

- **The `filterDescendants` and `findDescendants` methods are now depth-first.** This shouldn't affect almost anyone, since they are usually not the best things to be using for performance reasons. If you happen to have a very specific use case that needs breadth-first, (or even likely something better), you'll need to implement it yourself.

###### DEPRECATION CHANGES

- **Some `Node` methods have been deprecated!** There were a few methods that had been added over time that were either poorly named that have been deprecated and renamed, and a handful of methods that are no longer useful for the core library that have been deprecated. Here's a full list:
  - `areDescendantSorted` -> `areDescendantsSorted`
  - `getHighestChild` -> `getFurthestAncestor`
  - `getHighestOnlyChildParent` -> `getFurthestOnlyChildAncestor`
  - `concatChildren`
  - `decorateTexts`
  - `filterDescendantsDeep`
  - `findDescendantDeep`
  - `getChildrenBetween`
  - `getChildrenBetweenIncluding`
  - `isInlineSplitAtRange`


---


### `0.18.0` — March 2, 2017

###### BREAKING CHANGES

- **The `plugin.render` property is now called `plugin.renderPortal`.** This is to make way for the new `plugin.render` property that offers HOC-like behavior, so that plugins can augment the editor however they choose.


---


### `0.17.0` — February 27, 2017

###### DEPRECATION CHANGES

- **Some `Selection` methods have been deprecated!** Previously there were many inconsistencies in the naming and handling of selection changes. This has all been cleaned up, but in the process some methods have been deprecated. Here is a full list of the deprecated methods and their new alternatives:
  - `moveToOffsets` -> `moveOffsetsTo`
  - `moveForward` -> `move`
  - `moveBackward` -> `move`
  - `moveAnchorOffset` -> `moveAnchor`
  - `moveFocusOffset` -> `moveFocus`
  - `moveStartOffset` -> `moveStart`
  - `moveEndOffset` -> `moveEnd`
  - `extendForward` -> `extend`
  - `extendBackward` -> `extend`
  - `unset` -> `deselect`

- **Some selection transforms have been deprecated!** Along with the methods, the selection-based transforms have also been refactored, resulting in deprecations. Here is a full list of the deprecated transforms and their new alternatives:
  - `moveTo` -> `select`
  - `moveToOffsets` -> `moveOffsetsTo`
  - `moveForward` -> `move`
  - `moveBackward` -> `move`
  - `moveStartOffset` -> `moveStart`
  - `moveEndOffset` -> `moveEnd`
  - `extendForward` -> `extend`
  - `extendBackward` -> `extend`
  - `flipSelection` -> `flip`
  - `unsetSelection` -> `deselect`
  - `unsetMarks`


---


### `0.16.0` — December 2, 2016

###### BREAKING CHANGES

- **Inline nodes are now always surrounded by text nodes.** Previously this behavior only occured for inline nodes with `isVoid: true`. Now, all inline nodes will always be surrounded by text nodes. If text nodes don't exist, empty ones will be created. This allows for more consistent behavior across Slate, and parity with other editing experiences.


---


### `0.15.0` - November 17, 2016

###### BREAKING CHANGES

- **The unique `key` generated values have changed.** Previously, Slate generated unique keys that looked like `'9dk3'`. But they were not very conflict-resistant. Now the keys are simple string of auto-incrementing numbers, like `'0'`, `'1'`, `'2'`. This makes more clear that keys are simply a convenient way to uniquely reference nodes in the **short-term** lifespan of a single in-memory instance of Slate. They are not designed to be used for long-term uniqueness. A new `setKeyGenerator` function has been exported that allows you to pass in your own key generating mechanism if you want to ensure uniqueness.

- **The `Raw` serializer doesn't preserve keys by default.** Previously, the `Raw` serializer would omit keys when passed the `terse: true` option, but preserve them without it. Now it will always omit keys, unless you pass the new `preserveKeys: true` option. This better reflects that keys are temporary, in-memory IDs.

- **Operations on the document now update the selection when needed.** This won't affect you unless you were doing some very specific things with transforms and updating selections. Overall, this makes it much easier to write transforms, since in most cases, the underlying operations will update the selection as you would expect without you doing anything.

###### DEPRECATION CHANGES

- **Node accessor methods no longer accept being passed another node!** Previously, node accessor methods like `node.getParent` could be passed either a `key` string or a `node` object. For performance reasons, passing in a `node` object is being deprecated. So if you have any calls that look like: `node.getParent(descendant)`, they will now need to be written as `node.getParent(descendant.key)`. They will throw a warning for now, and will throw an error in a later version of Slate.


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

