# Changelog

This document maintains a list of changes to the `slate-react` package with each new version. Until `1.0.0` is released, breaking changes will be added as minor version bumps, and smaller changes won't be accounted for since the library is moving quickly.

---

### `0.14.0` — July 27, 2018

###### NEW

**Updated to work with the `slate@0.35.0` with paths.** It now uses the `PathUtils` export in the latest `slate` internally to work with paths. This isn't a breaking change, but to use this library with the latest Slate you'll need to upgrade.

---

### `0.13.0` — July 3, 2018

###### BREAKING

**The `isSelected` prop of nodes has changed.** Previously it was only `true` when the node was selected and the editor was focused. Now it is true even when the editor is not focused, and a new `isFocused` property has been added for the old behavior.

---

### `0.12.0` — February 21, 2018

###### BREAKING

**Update to use `slate@0.33.0`.** This is to match the changes to void node behavior where their content is no longer restricted.

---

### `0.11.0` — January 4, 2018

###### BREAKING

**The `kind` property of Slate objects has been renamed to `object`.** This is to reduce the confusion over the difference between "kind" and "type" which are practically synonyms. The "object" name was chosen to match the Stripe API, since it seems like a sensible choice and reads much more nicely when looking through JSON.

---

### `0.10.0` — October 27, 2017

###### BREAKING

**Remove all previously deprecated code paths.** This helps to reduce some of the complexity in Slate by not having to handle these code paths anymore. And it helps to reduce file size. When upgrading, it's _highly_ recommended that you upgrade to the previous version first and ensure there are no deprecation warnings being logged, then upgrade to this version.

---

### `0.9.0` — October 27, 2017

###### BREAKING

**Updated to use `slate@0.29.0`.** This is to gain access to the new `Value` model introduced in the newest version of Slate.

**Custom components no longer receive `props.state` or `props.schema`.** These are now exposed directly on the `props.editor` instance itself as `editor.value` and `editor.schema`. This helps eliminate a common issue where because of `shouldComponentUpdate` returning `false`, the `props.state` value was actually outdated, and transforming from it would cause incorrect behaviors.

**The `plugin.renderEditor` function's signature has changed.** Previously it received `(props, state, editor)` but it now receives just `(props, editor)`. If you need access to the editor's current value, use the new `editor.value` property. This is simply to clean up the API, since the value is already accessible on `editor`.

###### DEPRECATED

**The "state" has been renamed to "value" everywhere.** All of the current references are maintained as deprecations, so you should be able to upgrade and see warnings logged instead of being greeted with a broken editor. This is to reduce the confusion between React's "state" and Slate's editor value, and in an effort to further mimic the native DOM APIs.

**The editor `getSchema()`, `getStack()` and `getState()` methods are deprecated.** These have been replaced by property getters on the editor instance itself—`editor.schema`, `editor.stack` and `editor.value`, respectively. This is to reduce confusion with React's own `setState`, and to make accessing these commonly used properties more convenient.

###### NEW

**Added a new `editor.value` getter property.** This now mimics the DOM for things like `input.value` and `textarea.value`, and is the new way to access the editor's current value.

**Added new `editor.schema` and `editor.stack` getters.** Similarly to the new `value` getter, these two new getters give you access to the editor's current schema and stack.

---

### `0.8.0` — October 25, 2017

###### BREAKING

**The `Schema` objects in Slate have changed!** Previously, they used to be where you could define normalization rules, define rendering rules, and define decoration rules. This was overloaded, and made other improvements hard. Now, rendering and decorating is done via the newly added plugin functions (`renderNode`, `renderMark`, `decorateNode`). And validation is done either via the lower-level `validateNode` plugin function, or via the new `schema` objects.

**The `plugin.onBeforeChange` function was removed.** Previously there was both an `onBeforeChange` handler and an `onChange` handler. Now there is just an `onChange` handler, and the core plugin adds it's own logic before others.

**The `plugin.render` function was renamed to `plugin.renderEditor`.** It performs the same function, but has been renamed to disambiguate between all of the other new rendering functions available to plugins.

###### NEW

**`State` objects now have an embedded `state.schema` property.** This new schema property is used to automatically normalize the state as it changes, according to the editor's current schema. This makes normalization much easier.

**A new `renderNode` plugin function was added.** This is the new way to render nodes, instead of using the schema. Any plugin can define a `renderNode(props)` function which is passed the props to render the custom node component with. This is similar to `react-router`'s `render={...}` prop if you are familiar with that.

**A new `renderPlaceholder` plugin function was added.** This is similar to the `renderNode` helper, except for rendering placeholders.

**A new `decorateNode` plugin function was added.** This is similar to the old `rule.decorate` function from schemas. Any plugin can define a `decorateNode(node)` function and that can return extra decoration ranges of marks to apply to the document.

**A new `validateNode` plugin function was added.** This is the new way to do specific, custom validations. (There's also the new schema, which is the easier way to do most common validations.) Any plugin can define a `validateNode(node)` function that will be called to ensure nodes are valid. If they are valid, the function should return nothing. Otherwise, it should return a change function that normalizes the node to make it valid again.

---

### `0.7.0` — October 18, 2017

###### BREAKING

**The `<Placeholder>` component no longer exists!** Previously there was a `Placeholder` component exported from `slate-react`, but it had lots of problems and a confusing API. Instead, placeholder logic can now be defined via the `schema` by providing a `placeholder` component to render what a node is matched.

---

### `0.6.0` — October 16, 2017

###### BREAKING

**The `data` argument to event handlers has been removed.** Previously event handlers had a signature of `(event, data, change, editor)`, but now they have a signature of just `(event, change, editor)`. This leads to simpler internal Slate logic, and less complex relationship dependencies between plugins. All of the information inside the old `data` argument can be accessed via the similar properties on the `event` argument, or via the `getEventRange`, `getEventTransfer` and `setEventTransfer` helpers.

###### NEW

**Added a new `setEventTransfer` helper.** This is useful if you're working with `onDrop` or `onPaste` event and you want to set custom data in the event, to retrieve later or for others to consume. It takes a data `type` and a `value` to set the type do.

**Event handlers now have access to new events.** The `onClick`, `onCompositionEnd`, `onCompositionStart`, `onDragEnd`, `onDragEnter`, `onDragExit`, `onDragLeave`, `onDragOver`, `onDragStart`, and `onInput` events are all now newly exposed. Your plugin logic can use them to solve some more advanced use cases, and even override the internal Slate logic when necessary. 99% of use cases won't require them still, but they can be useful to have when needed.

---

### `0.5.0` — October 15, 2017

###### DEPRECATED

**The `data` objects in event handlers have been deprecated.** There were a few different issues with these "helpers": `data.key` didn't account for international keyboards, many properties awkwardly duplicated information that was available on `event.*`, but not completely, and many properties were confusing as to when they applied. If you were using these, you'll now need to use the native `event.*` properties instead. There's also a helpful [`is-hotkey`](https://github.com/ianstormtaylor/is-hotkey) package for more complex hotkey matching.

###### NEW

**Added a new `getEventRange` helper.** This gets the affected `Range` of Slate document given a DOM `event`. This is useful in the `onDrop` or `onPaste` handlers to retrieve the range in the document where the drop or paste will occur.

**Added a new `getEventTransfer` helper.** This gets any Slate-related data from an `event`. It is modelled after the DOM's [`DataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer) API, and is useful for retrieve the data being dropped or pasted in `onDrop` or `onPaste` events.

---

### `0.4.0` — October 14, 2017

###### BREAKING

**Updated work with `slate@0.27.0`.** The new version of Slate renames the old `Range` model to `Leaf`, and the old `Selection` model to `Range`.

###### NEW

**Added a new `findDOMRange` helper.** Give a Slate `Range` object, it will return a DOM `Range` object with the correct start and end points, making it easier to work with lower-level DOM selections.

**Added a new `findRange` helper.** Given either a DOM `Selection` or DOM `Range` object and a Slate `State`, it will return a Slate `Range` representing the same part of the document, making it easier to work with DOM selection changes.

**Added a new `findNode` helper.** Given a DOM `Element`, it will find the closest Slate `Node` that it represents, making

---

### `0.3.0` — October 13, 2017

###### BREAKING

**The decoration logic has been updated to use `slate@0.26.0`.** This allows for more complex decoration logic, and even decorations based on external information.

---

### `0.2.0` — September 29, 2017

###### BREAKING

**`onBeforeChange` is now called automatically again in `<Editor>`.** This was removed before, in attempt to decrease the "magic" that the editor was performing, since it normalizes when new props are passed to it, creating instant changes. But we discovered that it is actually necessary for now, so it has been added again.

---

### `0.1.0` — September 17, 2017

:tada:
