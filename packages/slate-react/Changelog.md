# Changelog

This document maintains a list of changes to the `slate-react` package with each new version. Until `1.0.0` is released, breaking changes will be added as minor version bumps, and smaller changes won't be accounted for since the library is moving quickly.

---

### `0.22.0` — May 8, 2019

###### BREAKING

**The `anchor.path` and `focus.path` of decorations must be relative!** Previously they were optional, and they were calculated based on the path in the top-level document. Now they are paths relative to the node being decorated! See the code highlighting example for how this is achieved, it ends up being easier than before.

**The `renderNode` middleware has been split into `renderBlock` and `renderInline`.** Previously the single middleware handled both node types. This change makes it easier to define the most common cases, and paves the way for similar serializers in the future. There is also a new `renderDocument` middleware, but most people don't need to concern themselves with it.

**The `renderMark` middleware is no longer used for decorations!** Previously `renderMark` would be used for rendering both types of decorations. Now there are separate `renderAnnotation` and `renderDecoration` middleware functions to use instead.

**You must now assign `attributes.ref` to a DOM node.** This new attribute that is passed to the rendering functions must be passed into a native DOM component (using `forwardRef` if necessary). This is required to eliminate our dependence on keys. If you are using libraries that don't implement `forwardRef` you may need to use `innerRef` or similar for this.

###### DEPRECATED

**The `find*` and `findDOM*` helpers are deprecated.** Previously you'd use these helpers to find a Slate object from a DOM object or vice versa. Now these helpers are all exposed as queries on the editor itself.

```js
// Before...
findDOMNode(key, window)
findNode(element, editor)

// After...
editor.findDOMNode(path)
editor.findNode(element)
```

---

### `0.21.0` — November 2, 2018

###### NEW

**Introducing the `slate-react-placeholder` package.** This new package is what handles the default `placeholder=` prop logic for the editor, and it can be used yourself for situations where you want to render browser-like placeholders in custom nodes.

###### BREAKING

**The `renderPlacehodler` middleware has been removed.** Previously this was how you rendered custom placeholders in the editor, but that logic can now be implemented with `decorateNode` instead, in a way that causes less confusion and overlap in the API. The new `slate-react-placeholder` package does exactly that, adding a decoration to the editor when it is empty.

---

### `0.20.0` — October 27, 2018

###### BREAKING

**Updated to work with `slate@0.43`.** The React bindings have been updated to work with the newest version of Slate which removes the `Change` object.

**The `Change` object has been removed.** The `Change` object as we know it previously has been removed, and all of its behaviors have been folded into the `Editor` controller. This includes the top-level commands and queries methods, as well as methods like `applyOperation` and `normalize`. _All places that used to receive `change` now receive `editor`, which is API equivalent._

**Changes are now flushed to `onChange` asynchronously.** Previously this was done synchronously, which resulted in some strange race conditions in React environments. Now they will always be flushed asynchronously, just like `setState`.

**The `render*`, `decorate*` and `shouldNodeComponentUpdate` middleware signatures have changed!** Previously the `render*`, `decorate*` and `shouldNodeComponentUpdate` middleware was passed `(props, next)`. However now, for consistency with the other middleware they are all passed `(props, editor, next)`. The `shouldNodeComponentUpdate` is passed `(prevProps, props, editor, next)`. This way, all middleware always receive `editor` and `next` as their final two arguments.

---

### `0.19.0` — October 9, 2018

###### NEW

**The `<Editor>` can now choose to not normalize on mount.** A nice side effect of splitting out the `Editor` logic into a reusable place is that it's easier to implement customizable behaviors for normalization. You can now pass an `options={{ normalize: false }}` prop to the React `<Editor>` which will disable the default normalization that takes place when the editor is constructed. This is helpful in cases where you are guaranteed to have an already normalized value, and don't want to incur the performance cost of normalizing it again.

**The middleware stack is now deferrable.** With the introduction of the `Editor` controller, the middleware stack in Slate has also been upgraded. Each middleware now receives a `next` function (similar to Express or Koa) that allows you to choose whether to iterating the stack or not.

```js
// Previously, you'd return `undefined` to continue.
function onKeyDown(event, editor, next) {
  if (event.key !== 'Enter') return
  ...
}

// Now, you call `next()` to continue...
function onKeyDown(event, editor, next) {
  if (event.key !== 'Enter') return next()
  ...
}
```

While that may seem inconvenient, it opens up an entire new behavior, which is deferring to the plugins later in the stack to see if they "handle" a specific case, and if not, handling it yourself:

```js
function onKeyDown(event, editor, next) {
  if (event.key === 'Enter') {
    const handled = next()
    if (handled) return handled

    // Otherwise, handle `Enter` yourself...
  }
}
```

This is how all of the core logic in `slate-react` is now implemented, eliminating the need for a "before" and an "after" plugin that duplicate logic.

Under the covers, the `schema`, `commands` and `queries` concept are all implemented as plugins that attach varying middleware as well. For example, commands are processed using the `onCommand` middleware under the covers:

```js
const plugin = {
  onCommand(command, editor, next) {
    ...
  }
}
```

This allows you to actually listen in to all commands, and override individual behaviors if you choose to do so, without having to override the command itself. This is a very advanced feature, which most people won't need, but it shows the flexibility provided by migrating all of the previously custom internal logic to be based on the new middleware stack.

###### BREAKING

**Updated to the latest version of `slate`.** The `slate-react` codebase has been updated to be compatible with the latest version of `slate`, `0.42.0`. This is a backward incompatible upgrade, and so the peer dependency range has been bumped.

**The middleware stack must now be explicitly continued, using `next`.** Previously returning `undefined` from a middleware would (usually) continue the stack onto the next middleware. Now, with middleware taking a `next` function argument you must explicitly decide to continue the stack by call `next()` yourself.

**The `editor` object is no longer passed to event handlers.** Previously, the third argument to event handlers would be the React `editor` instance. However, now that `Change` objects contain a direct reference to the editor, you can access this on `change.editor` instead.

```js
function onKeyDown(event, editor, next) {
  const { editor } = change
  ...
}
```

In its place is the new `next` argument, which allows you to choose to defer to the plugins further on the stack before handling the event yourself.

**The `findRange`, `findPoint`, `cloneFragment`, and `getEventRange` utils now take an `editor`.** Previously these utility functions took a `schema` argument, but this has been replaced with the new `editor` controller instead now that the `Schema` model has been removed.

---

### `0.18.0` — August 22, 2018

###### BREAKING

**Remove all previously deprecated code paths.** This helps to reduce some of the complexity in Slate by not having to handle these code paths anymore. And it helps to reduce file size. When upgrading, it's _highly_ recommended that you upgrade to the previous version first and ensure there are no deprecation warnings being logged, then upgrade to this version.

---

### `0.17.0` — August 22, 2018

###### NEW

**Updated to work with `slate@0.39.0` with the new `Decoration` and `Selection`.** This isn't a breaking change to any of the API's in `slate-react`, but it does update it to work with the newly introduced models and breaking changed in the newest version of Slate core.

---

### `0.16.0` — August 21, 2018

###### NEW

**Updated to work with `slate@0.38.0` without `node.isVoid`.** This isn't a breaking change to any of the API's in `slate-react` itself, but it does update it to no longer log deprecation warnings for `node.isVoid` property access.

---

### `0.15.0` — August 3, 2018

###### NEW

**Updated to work with `slate@0.37.0` with points.** This isn't a breaking change to any of the API's in `slate-react` itself, but it does update it to no longer depend on the core API's that were deprecated in `0.37.0`.

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

**The `data` argument to event handlers has been removed.** Previously event handlers had a signature of `(event, data, change, editor)`, but now they have a signature of just `(event, editor, next)`. This leads to simpler internal Slate logic, and less complex relationship dependencies between plugins. All of the information inside the old `data` argument can be accessed via the similar properties on the `event` argument, or via the `getEventRange`, `getEventTransfer` and `setEventTransfer` helpers.

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
