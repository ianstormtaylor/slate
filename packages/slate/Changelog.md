# Changelog

This document maintains a list of changes to the `slate` package with each new version. Until `1.0.0` is released, breaking changes will be added as minor version bumps, and smaller changes won't be accounted for since the library is moving quickly.

---

### `0.34.0` — June 14, 2018

###### BREAKING

* **Text nodes now represent their content as "leaves".** Previously their immutable representation used individual `Character` instance for each character. Now they have changed to group characters into `Leaf` models, which more closely resembles how they are used, and results in a _lot_ fewer immutable object instances floating around. _For most people this shouldn't cause any issues, since this is a low-level aspect of Slate._

###### DEPRECATED

* **The `Character` model is deprecated.** Although the character concept is still in the repository for now, it is deprecated and will be removed in a future release. Everything it solves can be solved with leaves instead.

###### NEW

* **Decorations can now be "atomic".** If you set a decoration as atomic, it will be removed when changed, preventing it from entering a "partial" state, which can be useful for some use cases.

---

### `0.33.0` — February 21, 2018

###### BREAKING

* **Void nodes no longer prescribe their text content.** Previously void nodes would automatically normalize their text content to be a single text node containing `' '` an empty string of content. This restriction was removed, so that void nodes can have arbitrary content. You can use this to store information in void nodes in a way that is more consistent with non-void nodes.

###### DEPRECATED

* **The `setBlock` method has been renamed to `setBlocks`.** This is to make it more clear that it operates on any of the current blocks in the selection, not just a single blocks.

* **The `setInline` method has been renamed to `setInlines`.** For the same reason as `setBlocks`, to be clear and stay consistent.

---

### `0.32.0` — January 4, 2018

###### BREAKING

* **The `kind` property of Slate objects has been renamed to `object`.** This is to reduce the confusion over the difference between "kind" and "type" which are practically synonyms. The "object" name was chosen to match the Stripe API, since it seems like a sensible choice and reads much more nicely when looking through JSON.

* **All normalization reasons containing `kind` have been renamed too.** Previously there were normalization reason strings like `child_kind_invalid`. These types of strings have been renamed to `child_object_invalid` to stay consistent.

---

### `0.31.0` — November 16, 2017

###### BREAKING

* **Operation objects in Slate are now immutable records.** Previously they were native, mutable Javascript objects. Now, there's a new immutable `Operation` model in Slate, ensuring that all of the data inside `Value` objects are immutable. And it allows for easy serialization of operations using `operation.toJSON()` for when sending them between editors. This should not affect most users, unless you are relying on changing the values of the low-level Slate operations (simply reading them is fine).

* **Operation lists in Slate are now immutable lists.** Previously they were native, mutable Javascript arrays. Now, to keep consistent with other immutable uses, they are immutable lists. This should not affect most users.

###### NEW

* **Added a new `Operation` model.** This model is used to store operations for the history stack, and (de)serializes them in a consistent way for collaborative editing use cases.

---

### `0.30.0` — October 27, 2017

###### BREAKING

* **Remove all previously deprecated code paths.** This helps to reduce some of the complexity in Slate by not having to handle these code paths anymore. And it helps to reduce file size. When upgrading, it's _highly_ recommended that you upgrade to the previous version first and ensure there are no deprecation warnings being logged, then upgrade to this version.

---

### `0.29.0` — October 27, 2017

###### BREAKING

* **The `set_state` operation has been renamed `set_value`**. This shouldn't affect almost anyone, but in the event that you were relying on the low-level operation types you'll need to update this.

###### DEPRECATED

* **The "state" has been renamed to "value" everywhere.** All of the current references are maintained as deprecations, so you should be able to upgrade and see warnings logged instead of being greeted with a broken editor. This is to reduce the confusion between React's "state" and Slate's editor value, and in an effort to further mimic the native DOM APIs.

###### NEW

* **Added the new `Value` model to replace `State`.** The new model is exactly the same, but with a new name. There is also a shimmed `State` model exported that warns when used, to ease migration.

---

### `0.28.0` — October 25, 2017

###### BREAKING

* **The `Schema` objects in Slate have changed!** Previously, they used to be where you could define normalization rules, define rendering rules, and define decoration rules. This was overloaded, and made other improvements hard. Now, rendering and decorating is done via the newly added plugin functions (`renderNode`, `renderMark`, `decorateNode`). And validation is done either via the lower-level `validateNode` plugin function, or via the new `schema` objects.

* **The `normalize*` change methods no longer take a `schema` argument.** Previously you had to maintain a reference to your schema, and pass it into the normalize methods when you called them. Since `State` objects now have an embedded `state.schema` property, this is no longer needed.

###### NEW

* **`State` objects now have an embedded `state.schema` property.** This new schema property is used to automatically normalize the state as it changes, according to the editor's current schema. This makes normalization much easier.

---

### `0.27.0` — October 14, 2017

###### BREAKING

* **The `Range` model is now called `Leaf`.** This is to disambiguate with the concept of "ranges" that is used throughout the codebase to be synonymous to selections. For example in methods like `getBlocksAtRange(selection)`.

* **The `text.ranges` property in the JSON representation is now `text.leaves`.** When passing in JSON with `text.ranges` you'll now receive a deprecation warning in the console in development.

###### DEPRECATED

* **The `Selection` model is now called `Range`.** This is to make it more clear what a "selection" really is, to make many of the other methods that act on "ranges" make sense, and to more closely parallel the native DOM API for selections and ranges. A mock `Selection` object is still exported with deprecated `static` methods, to make the transition to the new API easier.

* **The `Text.getRanges()` method is now `Text.getLeaves()`.** It will still work, and it will return a list of leaves, but you will see a deprecation warning in the console in development.

---

### `0.26.0` — October 13, 2017

###### BREAKING

* **The `decorate` function of schema rules has changed.** Previously, in `decorate` you would receive a text node and the matched node, and you'd need to manually add any marks you wanted to the text node's characters. Now, "decorations" have changed to just be `Selection` objects with marks in the `selection.marks` property. Instead of applying the marks yourself, you simply return selection ranges with the marks to be applied, and Slate will apply them internally. This makes it possible to write much more complex decoration behaviors. Check out the revamped [`code-highlighting`](https://github.com/ianstormtaylor/slate/blob/master/examples/code-highlighting/index.js) example and the new [`search-highlighting`](https://github.com/ianstormtaylor/slate/blob/master/examples/search-highlighting/index.js) example to see this in action.

* **The `set_data` operation type has been replaced by `set_state`.** With the new `state.decorations` property, it doesn't make sense to have a new operation type for every property of `State` objects. Instead, the new `set_state` operation more closely mimics the existing `set_mark` and `set_node` operations.

###### DEPRECATED

* **The `setData` change method has been replaced by `setState`.** Previously you would call `change.setData(data)`. But as new `State` properties are introduced it doesn't make sense to need to add new change methods each time. Instead, the new `change.setState(properties)` more closesely mimics the existing `setMarkByKey` and `setNodeByKey`. To achieve the old behavior, you can do `change.setState({ data })`.

* **The `preserveStateData` option of `state.toJSON` has changed.** The same behavior is now called `preserveData` instead. This makes it consistent with all of the existing options, and the new `preserveDecorations` option as well.

###### NEW

* **You can now set decorations based on external information.** Previously, the "decoration" logic in Slate was always based off of the text of a node, and would only re-render when that text changed. Now, there is a new `state.decorations` property that you can set via `change.setState({ decorations })`. You can use this to add presentation-only marks to arbitrary ranges of text in the document. Check out the new [`search-highlighting`](https://github.com/ianstormtaylor/slate/blob/master/examples/search-highlighting/index.js) example to see this in action.

---

### `0.25.0` — September 21, 2017

###### BREAKING

* **The `insertBlock` change method no longer replaces empty blocks.** Previously if you used `insertBlock` and the selection was in an empty block, it would replace it. Now you'll need to perform that check yourself and use the new `replaceNodeByKey` method instead.

* **The `Block.create` and `Inline.create` methods no longer normalize.** Previously if you used one of them to create a block or inline with zero nodes in it, they would automatically add a single empty text node as the only child. This was unexpected in certain situations, and if you were relying on this you'll need to handle it manually instead now.

---

### `0.24.0` — September 11, 2017

###### BREAKING

* **`immutable` is now a _peer_ dependency of Slate.** Previously it was a regular dependency, but this prevented you from bringing your own version, or you'd have duplication. You'll need to ensure you install it!

* **The `Html`, `Plain` and `Raw` serializers are broken into new packages.** Previously you'd import them from `slate`. But now you'll import them from `slate-html-serializer` and `slate-plain-serializer`. And the `Raw` serializer that was deprecated is now removed.

* **The `Editor` and `Placeholder` components are broken into a new React-specific package.** Previously you'd import them from `slate`. But now you `import { Editor } from 'slate-react'` instead.

###### NEW

* **Slate is now a "monorepo".** Instead of a single package, Slate has been divided up into individual packages so that you can only require what you need, cutting down on file size. In the process, some helpful modules that used to be internal-only are now exposed.

* **There's a new `slate-hyperscript` helper.** This was possible thanks to the work on [`slate-sugar`](https://github.com/GitbookIO/slate-sugar), which paved the way.

* **The `slate-prop-types` package is now exposed.** Previously this was an internal module, but now you can use it for adding prop types to any components or plugins you create.

* **The `slate-simulator` package is now exposed.** Previously this was an internal testing utility, but now you can use it in your own tests as well. It's currently pretty bare bones, but we can add to it over time.

---

### `0.23.0` — September 10, 2017

###### BREAKING

* **The `isNative` property of `State` has been removed.** Previously this was used for performance reasons to avoid re-rendering, but it is no longer needed. This shouldn't really affect most people because it's rare that you'd be relying on this property to exist.

###### DEPRECATED

* **The `Raw` serializer is now deprecated.** The entire "raw" concept is being removed, in favor of allowing all models to be able to serialize and deserialize to JSON themselves. Instead of using the `Raw` serializer, you can now use the `fromJSON` and `toJSON` on the models directly.

* **The `toRaw` options for the `Plain` and `Html` serializers are now called `toJSON`.** This is to stay symmetrical with the removal of the "raw" concept everywhere.

* **The `terse` option for JSON serialization has been deprecated!** This option causes lots of abstraction leakiness because it means there is no one canonical JSON representation of objects. You had to work with either terse or not terse data.

* **The `Html` serializer no longer uses the `terse` representation.** This shouldn't actually be an issue for anyone because the main manifestation of this has a deprecation notice with a patch in place for now.

* **The `defaultBlockType` of the `Html` serializer is now called `defaultBlock`.** This is just to make it more clear that it supports not only setting the default `type` but also `data` and `isVoid`.

###### NEW

* **Slate models now have `Model.fromJSON(object)` and `model.toJSON()` methods.** These methods operate with the canonical JSON form (which used to be called "raw"). This way you don't need to `import` a serializer to retrieve JSON, if you have the model you can serialize/deserialize.

* **Models also have `toJS` and `fromJS` aliases.** This is just to match Immutable.js objects, which have both methods. For Slate though, the methods are equivalent.

---

### `0.22.0` — September 5, 2017

###### BREAKING

* **The `Plain` serializer now adds line breaks between blocks.** Previously between blocks the text would be joined without any space whatsoever, but this wasn't really that useful or what you'd expect.

* **The `toggleMark` transform now checks the intersection of marks.** Previously, toggling would remove the mark from the range if any of the characters in a range didn't have it. However, this wasn't what all other rich-text editors did, so the behavior has changed to mimic the standard behavior. Now, if any characters in the selection have the mark applied, it will first be added when toggling.

* **The `.length` property of nodes has been removed.** This property caused issues with code like in Lodash that checked for "array-likeness" by simply looking for a `.length` property that was a number.

* **`onChange` now receives a `Change` object (previously named `Transform`) instead of a `State`.** This is needed because it enforces that all changes are represented by a single set of operations. Otherwise right now it's possible to do things like `state.transform()....apply({ save: false }).transform()....apply()` and result in losing the operation information in the history. With OT, we need all transforms that may happen to be exposed and emitted by the editor. The new syntax looks like:

```js
onChange(change) {
  this.setState({ state: change.state })
}

onChange({ state }) {
  this.setState({ state })
}
```

* **Similarly, handlers now receive `e, data, change` instead of `e, data, state`.** Instead of doing `return state.transform()....apply()` the plugins can now act on the change object directly. Plugins can still `return change...` if they want to break the stack from continuing on to other plugins. (Any `!= null` value will break out.) But they can also now not return anything, and the stack will apply their changes and continue onwards. This was previously impossible. The new syntax looks like:

```js
function onKeyDown(e, data, change) {
  if (data.key == 'enter') {
    return change.splitBlock()
  }
}
```

* **The `onChange` and `on[Before]Change` handlers now receive `Change` objects.** Previously they would also receive a `state` object, but now they receive `change` objects like the rest of the plugin API.

* **The `.apply({ save })` option is now `state.change({ save })` instead.** This is the easiest way to use it, but requires that you know whether to save or not up front. If you want to use it inline after already saving some changes, you can use the `change.setOperationFlag('save', true)` flag instead. This shouldn't be necessary for 99% of use cases though.

* **The `.undo()` and `.redo()` transforms don't save by default.** Previously you had to specifically tell these transforms not to save into the history, which was awkward. Now they won't save the operations they're undoing/redoing by default.

* **`onBeforeChange` is no longer called from `componentWillReceiveProps`,** when a new `state` is passed in as props to the `<Editor>` component. This caused lots of state-management issues and was weird in the first place because passing in props would result in changes firing. **It is now the parent component's responsibility to not pass in improperly formatted `State` objects**.

* **The `splitNodeByKey` change method has changed to be shallow.** Previously, it would deeply split to an offset. But now it is shallow and another `splitDescendantsByKey` change method has been added (with a different signature) for the deep splitting behavior. This is needed because splitting and joining operations have been changed to all be shallow, which is required so that operational transforms can be written against them.

* **Blocks cannot have mixed "inline" and "block" children anymore.** Blocks were implicitly expected to either contain "text" and "inline" nodes only, or to contain "block" nodes only. Invalid case are now normalized by the core schema.

* **The shape of many operations has changed.** This was needed to make operations completely invertible without any extra context. The operations were never really exposed in a consumable way, so I won't detail all of the changes here, but feel free to look at the source to see the details.

* **All references to "joining" nodes is now called "merging".** This is to be slightly clearer, since merging can only happen with adjacent nodes already, and to have a nicer parallel with "splitting", as in cells. The operation is now called `merge_node`, and the transforms are now `merge*`.

###### DEPRECATED

* **The `transform.apply()` method is deprecated.** Previously this is where the saving into the history would happen, but it created an awkward convention that wasn't necessary. Now operations are saved into the history as they are created with change methods, instead of waiting until the end. You can access the new `State` of a change at any time via `change.state`.

###### NEW

* **The `state.activeMarks` returns the intersection of marks in the selection.** Previously there was only `state.marks` which returns marks that appeared on _any_ character in the selection. But `state.activeMarks` returns marks that appear on _every_ character in the selection, which is often more useful for implementing standard rich-text editor behaviors.

---

### `0.21.0` — July 20, 2017

###### BREAKING

* **The `Html` serializer now uses `DOMParser` instead of `cheerio`.** Previously, the `Html` serializer used the `cheerio` library for representing elements in the serialization rule logic, but cheerio was a very large dependency. It has been removed, and the native browser `DOMParser` is now used instead. All HTML serialization rules will need to be updated. If you are working with Slate on the server, you can now pass in a custom serializer to the `Html` constructor, using the `parse5` library.

---

### `0.20.0` — May 17, 2017

###### BREAKING

* **Returning `null` from the `Html` serializer skips the element.** Previously, `null` and `undefined` had the same behavior of skipping the rule and trying the rest of the rules. Now if you explicitly return `null` it will skip the element itself.

---

### `0.19.0` — March 3, 2017

###### BREAKING

* **The `filterDescendants` and `findDescendants` methods are now depth-first.** This shouldn't affect almost anyone, since they are usually not the best things to be using for performance reasons. If you happen to have a very specific use case that needs breadth-first, (or even likely something better), you'll need to implement it yourself.

###### DEPRECATED

* **Some `Node` methods have been deprecated!** There were a few methods that had been added over time that were either poorly named that have been deprecated and renamed, and a handful of methods that are no longer useful for the core library that have been deprecated. Here's a full list:
  * `areDescendantSorted` -> `areDescendantsSorted`
  * `getHighestChild` -> `getFurthestAncestor`
  * `getHighestOnlyChildParent` -> `getFurthestOnlyChildAncestor`
  * `concatChildren`
  * `decorateTexts`
  * `filterDescendantsDeep`
  * `findDescendantDeep`
  * `getChildrenBetween`
  * `getChildrenBetweenIncluding`
  * `isInlineSplitAtRange`

---

### `0.18.0` — March 2, 2017

###### BREAKING

* **The `plugin.render` property is now called `plugin.renderPortal`.** This is to make way for the new `plugin.render` property that offers HOC-like behavior, so that plugins can augment the editor however they choose.

---

### `0.17.0` — February 27, 2017

###### DEPRECATED

* **Some `Selection` methods have been deprecated!** Previously there were many inconsistencies in the naming and handling of selection changes. This has all been cleaned up, but in the process some methods have been deprecated. Here is a full list of the deprecated methods and their new alternatives:

  * `moveToOffsets` -> `moveOffsetsTo`
  * `moveForward` -> `move`
  * `moveBackward` -> `move`
  * `moveAnchorOffset` -> `moveAnchor`
  * `moveFocusOffset` -> `moveFocus`
  * `moveStartOffset` -> `moveStart`
  * `moveEndOffset` -> `moveEnd`
  * `extendForward` -> `extend`
  * `extendBackward` -> `extend`
  * `unset` -> `deselect`

* **Some selection transforms have been deprecated!** Along with the methods, the selection-based transforms have also been refactored, resulting in deprecations. Here is a full list of the deprecated transforms and their new alternatives:
  * `moveTo` -> `select`
  * `moveToOffsets` -> `moveOffsetsTo`
  * `moveForward` -> `move`
  * `moveBackward` -> `move`
  * `moveStartOffset` -> `moveStart`
  * `moveEndOffset` -> `moveEnd`
  * `extendForward` -> `extend`
  * `extendBackward` -> `extend`
  * `flipSelection` -> `flip`
  * `unsetSelection` -> `deselect`
  * `unsetMarks`

---

### `0.16.0` — December 2, 2016

###### BREAKING

* **Inline nodes are now always surrounded by text nodes.** Previously this behavior only occured for inline nodes with `isVoid: true`. Now, all inline nodes will always be surrounded by text nodes. If text nodes don't exist, empty ones will be created. This allows for more consistent behavior across Slate, and parity with other editing experiences.

---

### `0.15.0` - November 17, 2016

###### BREAKING

* **The unique `key` generated values have changed.** Previously, Slate generated unique keys that looked like `'9dk3'`. But they were not very conflict-resistant. Now the keys are simple string of auto-incrementing numbers, like `'0'`, `'1'`, `'2'`. This makes more clear that keys are simply a convenient way to uniquely reference nodes in the **short-term** lifespan of a single in-memory instance of Slate. They are not designed to be used for long-term uniqueness. A new `setKeyGenerator` function has been exported that allows you to pass in your own key generating mechanism if you want to ensure uniqueness.

* **The `Raw` serializer doesn't preserve keys by default.** Previously, the `Raw` serializer would omit keys when passed the `terse: true` option, but preserve them without it. Now it will always omit keys, unless you pass the new `preserveKeys: true` option. This better reflects that keys are temporary, in-memory IDs.

* **Operations on the document now update the selection when needed.** This won't affect you unless you were doing some very specific things with transforms and updating selections. Overall, this makes it much easier to write transforms, since in most cases, the underlying operations will update the selection as you would expect without you doing anything.

###### DEPRECATED

* **Node accessor methods no longer accept being passed another node!** Previously, node accessor methods like `node.getParent` could be passed either a `key` string or a `node` object. For performance reasons, passing in a `node` object is being deprecated. So if you have any calls that look like: `node.getParent(descendant)`, they will now need to be written as `node.getParent(descendant.key)`. They will throw a warning for now, and will throw an error in a later version of Slate.

---

### `0.14.0` — September 10, 2016

###### BREAKING

* **The `undo` and `redo` transforms need to be applied!** Previously, `undo` and `redo` were special cased such that they did not require an `.apply()` call, and instead would return a new `State` directly. Now this is no longer the case, and they are just like every other transform.

* **Transforms are no longer exposed on `State` or `Node`.** The transforms API has been completely refactored to be built up of "operations" for collaborative editing support. As part of this refactor, the transforms are now only available via the `state.transform()` API, and aren't exposed on the `State` or `Node` objects as they were before.

* **`Transform` objects are now mutable.** Previously `Transform` was an Immutable.js `Record`, but now it is a simple constructor. This is because transforms are inherently mutating their representation of a state, but this decision is [up for discussion](https://github.com/ianstormtaylor/slate/issues/328).

* **The selection can now be "unset".** Previously, a selection could never be in an "unset" state where the `anchorKey` or `focusKey` was null. This is no longer technically true, although this shouldn't really affect anyone in practice.

---

### `0.13.0` — August 15, 2016

###### BREAKING

* **The `renderNode` and `renderMark` properties are gone!** Previously, rendering nodes and marks happened via these two properties of the `<Editor>`, but this has been replaced by the new `schema` property. Check out the updated examples to see how to define a schema! There's a good chance this eliminates extra code for most use cases! :smile:

* **The `renderDecorations` property is gone!** Decoration rendering has also been replaced by the new `schema` property of the `<Editor>`.

---

### `0.12.0` — August 9, 2016

###### BREAKING

* **The `data.files` property is now an `Array`.** Previously it was a native `FileList` object, but needed to be changed to add full support for pasting an dropping files in all browsers. This shouldn't affect you unless you were specifically depending on it being array-like instead of a true `Array`.

---

### `0.11.0` — August 4, 2016

###### BREAKING

* **Void nodes are renderered implicitly again!** Previously Slate had required that you wrap void node renderers yourself with the exposed `<Void>` wrapping component. This was to allow for selection styling, but a change was made to make selection styling able to handled in Javascript. Now the `<Void>` wrapper will be implicitly rendered by Slate, so you do not need to worry about it, and "voidness" only needs to toggled in one place, the `isVoid: true` property of a node.

---

### `0.10.0` — July 29, 2016

###### BREAKING

* **Marks are now renderable as components.** Previously the only supported way to render marks was by returning a `style` object. Now you can return a style object, a class name string, or a full React component. Because of this, the DOM will be renderered slightly differently than before, resulting in an extra `<span>` when rendering non-component marks. This won't affect you unless you were depending on the DOM output by Slate for some reason.

---

### `0.9.0` — July 28, 2016

###### BREAKING

* **The `wrap` and `unwrap` method signatures have changed!** Previously, you would pass `type` and `data` as separate parameters, for example: `wrapBlock('code', { src: true })`. This was inconsistent with other transforms, and has been updated such that a single argument of `properties` is passed instead. So that example could now be: `wrapBlock({ type: 'code', { data: { src: true }})`. You can still pass a `type` string as shorthand, which will be the most frequent use case, for example: `wrapBlock('code')`.

---

### `0.8.0` — July 27, 2016

###### BREAKING

* **The `onKeyDown` and `onBeforeInput` handlers signatures have changed!** Previously, some Slate handlers had a signature of `(e, state, editor)` and others had a signature of `(e, data, state, editor)`. Now all handlers will be passed a `data` object—which contains Slate-specific data related to the event—even if it is empty. This is helpful for future compatibility where we might need to add data to a handler that previously didn't have any, and is nicer for consistency. The `onKeyDown` handler's new `data` object contains the `key` name, `code` and a series of `is*` properties to make working with hotkeys easier. The `onBeforeInput` handler's new `data` object is empty.

* **The `Utils` export has been removed.** Previously, a `Key` utility and the `findDOMNode` utility were exposed under the `Utils` object. The `Key` has been removed in favor of the `data` object passed to `onKeyDown`. And then `findDOMNode` utility has been upgraded to a top-level named export, so you'll now need to access it via `import { findDOMNode } from 'slate'`.

* **Void nodes now permanently have `" "` as content.** Previously, they contained an empty string, but this isn't technically correct, since they have content and shouldn't be considered "empty". Now they will have a single space of content. This shouldn't really affect anyone, unless you happened to be accessing that string for serialization.

* **Empty inline nodes are now impossible.** This is to stay consistent with native `contenteditable` behavior, where although technically the elements can exist, they have odd behavior and can never be selected.

---

### `0.7.0` — July 24, 2016

###### BREAKING

* **The `Raw` serializer is no longer terse by default!** Previously, the `Raw` serializer would return a "terse" representation of the document, omitting information that wasn't _strictly_ necessary to deserialize later, like the `key` of nodes. By default this no longer happens. You have to opt-in to the behavior by passing `{ terse: true }` as the second `options` argument of the `deserialize` and `serialize` methods.

---

### `0.6.0` — July 22, 2016

###### BREAKING

* **Void components are no longer rendered implicity!** Previously, Slate would automatically wrap any node with `isVoid: true` in a `<Void>` component. But doing this prevented you from customizing the wrapper, like adding a `className` or `style` property. So you **must now render the wrapper yourself**, and it has been exported as `Slate.Void`. This, combined with a small change to the `<Void>` component's structure allows the "selected" state of void nodes to be rendered purely with CSS based on the `:focus` property of a `<Void>` element, which previously [had to be handled in Javascript](https://github.com/ianstormtaylor/slate/commit/31782cb11a272466b6b9f1e4d6cc0c698504d97f). This allows us to streamline selection-handling logic, improving performance and reducing complexity.

* **`data-offset-key` is now `<key>-<index>` instead of `<key>:<start>-<end>`.** This shouldn't actually affect anyone, unless you were specifically relying on that attribute in the DOM. This change greatly reduces the number of re-renders needed, since previously any additional characters would cause a cascading change in the `<start>` and `<end>` offsets of latter text ranges.

---

### `0.5.0` — July 20, 2016

###### BREAKING

* **`node.getTextNodes()` is now `node.getTexts()`.** This is just for consistency with the other existing `Node` methods like `getBlocks()`, `getInlines()`, etc. And it's nicely shorter. :wink:

* **`Node` methods now `throw` earlier during unexpected states.** This shouldn't break anything for most folks, unless a strange edge-case was going undetected previously.

---

### `0.4.0` — July 20, 2016

###### BREAKING

* **`renderMark(mark, state, editor)` is now `renderMark(mark, marks, state, editor)`.** This change allows you to render marks based on multiple `marks` presence at once on a given range of text, for example using a custom `BoldItalic.otf` font when text has both `bold` and `italic` marks.

---

### `0.3.0` — July 20, 2016

###### BREAKING

* **`transform.unwrapBlock()` now unwraps selectively.** Previously, calling `unwrapBlock` with a range representing a middle sibling would unwrap _all_ of the siblings, removing the wrapping block entirely. Now, calling it with those same arguments will only move the middle sibling up a layer in the hierarchy, preserving the nesting on any of its siblings. This changes makes it much simpler to implement functionality like unwrapping a single list item, which previously would unwrap the entire list.

---

### `0.2.0` — July 18, 2016

###### BREAKING

* **`transform.mark()` is now `transform.addMark()` and `transform.unmark()` is now `transform.removeMark()`.** The new names make it clearer that the transforms are actions being performed, and it paves the way for adding a `toggleMark` convenience as well.

---

### `0.1.0` — July 13, 2016

:tada:
