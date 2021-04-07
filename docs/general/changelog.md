# Changelog

This is a list of changes to Slate with each new release. Until `1.0` is released, breaking changes will be added as minor version bumps, and smaller, patch-level changes won't be noted since the library is moving quickly while in beta.

> ⚠️ Until [https://github.com/atlassian/changesets/issues/264](https://github.com/atlassian/changesets/issues/264) is solved, each package will maintain its own individual changelog, which you can find here:
>
> - [slate](https://github.com/ianstormtaylor/slate/tree/71ff94c8d866a3ad9582ec4b84258d99d508fd70/packages/slate/CHANGELOG.md)
> - [slate-history](https://github.com/ianstormtaylor/slate/tree/71ff94c8d866a3ad9582ec4b84258d99d508fd70/packages/slate-history/CHANGELOG.md)
> - [slate-hyperscript](https://github.com/ianstormtaylor/slate/tree/71ff94c8d866a3ad9582ec4b84258d99d508fd70/packages/slate-hyperscript/CHANGELOG.md)
> - [slate-react](https://github.com/ianstormtaylor/slate/tree/71ff94c8d866a3ad9582ec4b84258d99d508fd70/packages/slate-react/CHANGELOG.md)

## `0.61` — March 29, 2021

### BREAKING

**New CustomTypes for Editor, Element, Text and other implementation specific objects.** Improved typing with TypeScript lets you add CustomTypes for the Slate Editor. This change requires you to set up your types at the start. It's a new concept so please read the new TypeScript documentation here: [https://docs.slatejs.org/concepts/11-typescript](https://docs.slatejs.org/concepts/11-typescript)

## `0.60` — November 24, 2020

### BREAKING

**Introduced new customizable TypeScript typings.** You can override the built-in types to extend them for your own editor's domain model. However the changes to make this possible likely resulted in some changes to the existing type contracts.

**The `useEditor` hook was renamed to `useSlateStatic`.** This was done to better differentiate between the `useSlate` hook and to make it clear that the static version will not re-render when changes occur.

## `0.59` — September 24, 2020

_There were no breaking changes or new additions in this release._

## `0.58` — May 5th, 2020

### BREAKING

**User properties on Elements and Texts now have an unknown type instead of any.** Previously, the arbitrary user defined keys on the `Text` and `Element` interface had a type of `any` which effectively removed any potential type checking on those properties. Now these have a type of `unknown` so that type checking can be done by consumers of the API when they are applying their own custom properties to the `Text`s and `Element`s.

## `0.57` — December 18, 2019

### BREAKING

**Overridable commands now live directly on the editor object.** Previously the `Command` concept was implemented as an interface that was passed into the `editor.exec` function, allowing the "core" commands to be overridden in one place. But this introduced a lot of Redux-like indirection when implementing custom commands that wasn't necessary because they are never overridden. Instead, now the core actions that can be overridden are implemented as individual functions on the editor \(eg. `editor.insertText`\) and they can be overridden just like any other function \(eg. `isVoid`\).

Previously to override a command you'd do:

```javascript
const withPlugin = editor => {
  const { exec } = editor

  editor.exec = command => {
    if (command.type === 'insert_text') {
      const { text } = command

      if (myCustomLogic) {
        // ...
        return
      }
    }

    exec(command)
  }

  return editor
}
```

Now, you'd override the specific function directly:

```javascript
const withPlugin = editor => {
  const { insertText } = editor

  editor.insertText = text => {
    if (myCustomLogic) {
      // ...
      return
    }

    insertText(text)
  }

  return editor
}
```

You shouldn't ever need to call these functions directly! They are there for plugins to tap into, but there are higher level helpers for you to call whenever you actually need to invoke them. Read on…

**Transforms now live in a separate namespace of helpers.** Previously the document and selection transformation helpers were available directly on the `Editor` interface as `Editor.*`. But these helpers are fairly low level, and not something that you'd use in your own codebase all over the place, usually only inside specific custom helpers of your own. To make room for custom userland commands, these helpers have been moved to a new `Transforms` namespace.

Previously you'd write:

```javascript
Editor.unwrapNodes(editor, ...)
```

Now you'd write:

```javascript
Transforms.unwrapNodes(editor, ...)
```

**The `Command` interfaces were removed.** As part of those changes, the existing `Command`, `CoreCommand`, `HistoryCommand`, and `ReactCommand` interfaces were all removed. You no longer need to define these "command objects", because you can just call the functions directly. Plugins can still define their own overridable commands by extending the `Editor` interface with new functions. The `slate-react` plugin does this with `insertData` and the `slate-history` plugin does this with `undo` and `redo`.

### NEW

**User action helpers now live directly on the `Editor.*` interface.** These are taking the place of the existing `Transforms.*` helpers that were moved. These helpers are equivalent to user actions, and they always operate on the existing selection. There are some defined by core, but you are likely to define your own custom helpers that are specific to your domain as well.

For example, here are some of the built-in actions:

```javascript
Editor.insertText(editor, 'a string of text')
Editor.deleteForward(editor)
Editor.deleteBackward(editor, { unit: 'word' })
Editor.addMark(editor, 'bold', true)
Editor.insertBreak(editor)
...
```

Every one of the old "core commands" has an equivalent `Editor.*` helper exposed now. However, you can easily define your own custom helpers and place them in a namespace as well:

```javascript
const MyEditor = {
  ...Editor,
  insertParagraph(editor) { ... },
  toggleBoldMark(editor) { ... },
  formatLink(editor, url) { ... },
  ...
}
```

Whatever makes sense for your specific use case!

## `0.56` — December 17, 2019

### BREAKING

**The `format_text` command is split into `add_mark` and `remove_mark`.** Although the goal is to keep the number of commands in core to a minimum, having this as a combined command made it very hard to write logic that wanted to guarantee to only ever add or remove a mark from a text node. Now you can be guaranteed that the `add_mark` command will only ever add custom properties to text nodes, and the `remove_mark` command will only ever remove them.

Previously you would write:

```javascript
editor.exec({
  type: 'format_text',
  properties: { bold: true },
})
```

Now you would write:

```javascript
if (isActive) {
  editor.exec({ type: 'remove_mark', key: 'bold' })
} else {
  editor.exec({ type: 'add_mark', key: 'bold', value: true })
}
```

> 🤖 Note that the "mark" term does not mean what it meant in `0.47` and earlier. It simply means formatting that is applied at the text level—bold, italic, etc. We need a term for it because it's such a common pattern in richtext editors, and "mark" is often the term that is used. For example the `<mark>` tag in HTML.

**The `Node.text` helper was renamed to `Node.string`.** This was simply to reduce the confusion between "the text string" and "text nodes". The helper still just returns the concatenated string content of a node.

## `0.55` — December 15, 2019

### BREAKING

**The `match` option must now be a function.** Previously there were a few shorthands, like passing in a plain object. This behavior was removed because it made it harder to reason about exactly what was being matched, it made debugging harder, and it made it hard to type well. Now the `match` option must be a function that receives the `Node` object to match. If you're using TypeScript, and the function you pass in is a type guard, that will be taken into account in the return value!

Previously you might write:

```javascript
Editor.nodes(editor, {
  at: range,
  match: 'text',
})

Editor.nodes(editor, {
  at: range,
  match: { type: 'paragraph' },
})
```

Now you'd write:

```javascript
Editor.nodes(editor, {
  at: range,
  match: Text.isText,
})

Editor.nodes(editor, {
  at: range,
  match: node => node.type === 'paragraph',
})
```

**The `mode` option now defaults to `'lowest'`.** Previously the default varied depending on where in the codebase it was used. Now it defaults to `'lowest'` everywhere, and you can always pass in `'highest'` to change the behavior. The one exception is the `Editor.nodes` helper which defaults to `'all'` since that's the expected behavior most of the time.

**The `Editor.match` helper was renamed to `Editor.above`.** This was just to make it clear how it searched in the tree—it looks through all of the nodes directly above a location in the document.

**The `Editor.above/previous/next` helpers now take all options in a dictionary.** Previously their APIs did not exactly match the `Editor.nodes` helper which they are shorthand for, but now this is no longer the case. The `at`, `match` and `mode` options are all passed in the `options` argument.

Previously you would use:

```javascript
Editor.previous(editor, path, n => Text.isText(n), {
  mode: 'lowest',
})
```

Now you'd use:

```javascript
Editor.previous(editor, {
  at: path,
  match: n => Text.isText(n),
  mode: 'lowest',
  ...
})
```

**The `Editor.elements` and `Editor.texts` helpers were removed.** These were simple convenience helpers that were rarely used. You can now achieve the same thing by using the `Editor.nodes` helper directly along with the `match` option. For example:

```javascript
Editor.nodes(editor, {
  at: range,
  match: Element.isElement,
})
```

## `0.54` — December 12, 2019

### BREAKING

**The `<Slate>` `onChange` handler no longer receives the `selection` argument.** Previously it received `(value, selection)`, now it receives simply `(value)`. Instead, you can access any property of the editor directly \(including the value as `editor.children`\). The `value/onChange` convention is provided purely for form-related use cases that expect it. This is along with the change to how extra props are "controlled". By default they are uncontrolled, but you can pass in any of the other top-level editor properties to take control of them.

**The `Command` and `CoreCommand` interfaces have been split apart.** Previously you could access `Command.isCoreCommand`, however now this helper lives directly on the core command interface as `CoreCommand.isCoreCommand`. This makes it more symmetrical with userland commands.

**Command checkers have been simplified.** Previously Slate exposed command-checking helpers like `Command.isInsertTextCommand`. However these were verbose and not useful most of the time. Instead, you can now check for `CoreCommand.isCoreCommand` and then use the `command.type` property to narrow further. This keeps core more symmetrical with how userland will implement custom commands.

### NEW

**The `<Slate>` component is now pseudo-controlled.** It requires a `value=` prop to be passed in which is controlled. However, the `selection`, `marks`, `history`, or any other props are not required to be controlled. They default to being uncontrolled. If your use case requires controlling these extra props you can pass them in and they will start being controlled again. This change was made to make using Slate easier, while still allowing for more complex state to be controlled by core or plugins going forward—state that users don't need to concern themselves with most of time.

**The `Editor` now has a `marks` property.** This property represents text-level formatting that will be applied to the next character that is inserted. This is a common richtext editor behavior, where pressing a **Bold** button with a collapsed selection turns on "bold" formatting mode, and then typing a character becomes bold. This state isn't stored in the document, and is instead stored as an extra property on the editor itself.

## `0.53` — December 10, 2019

### BREAKING

**The `slate-schema` package has been removed!** This decision was made because with the new helpers on the `Editor.*` interface, and with the changes to `normalizeNode` in the latest version of Slate, adding constraints using `normalizeNode` actually leads to more maintainable code than using `slate-schema`. Previously it was required to keep things from getting too unreadable, but that always came at a large cost of indirection and learning additional APIs. Everything you could do with `slate-schema` you can do with `normalizeNode`, and more.

**Node matching functions now receive just a `Node`.** Previously they received a `NodeEntry` tuple, which consisted of `[node, path]`. However now they receive only a `node` argument, which makes it easier to write one-off node-checking helpers and pass them in directly as arguments. If you need to ensure a path, lookup the node first.

**A few unnecessary helpers were removed.** There were a handful of leftovers helpers that were not used anywhere in Slate's core logic, and were very unlikely to be used in userland, so they've been removed to reduce bundle size. You are always free to re-implement them if you truly need them. The list of helpers removed is:

- `Editor.ancestor`
- `Node.closest`
- `Node.furthest`
- `Range.exists`
- `Range.isRangeList`
- `Range.isRangeMap`

## `0.52` — December 5, 2019

### BREAKING

**The `slate-schema` package now exports a factory.** Previously you imported the `withSchema` function directly from the package, and passed in your schema rules when you called it. However, now you import the `defineSchema` factory instead which takes your schema rules and returns a custom `withSchema` plugin function. This way you can still use helpers like `compose` with the plugin, while pre-defining your custom rules.

**The `properties` validation in the schema is now exhaustive.** Previously a `properties` validation would check any properties you defined, and leave any unknown ones as is. This made it hard to be certain about which properties would end up on a node. Now any non-defined properties are considered invalid. And using an empty `{}` validation would ensure that there are no custom properties at all.

### NEW

**The `leaves` schema validation ensures text-level formatting.** You can use it from any higher up element node in the tree, to guarantee that it only contains certain types of text-level formatting on its inner text nodes. For example you could use it to ensure that a `code` block doesn't allow any of its text to be bolded or italicized.

## `0.51` — December 5, 2019

### BREAKING

**The `Mark` interface has been removed!** Previously text-level formatting was stored in an array of unique marks. Now that same formatting is stored directly on the `Text` nodes themselves. For example instead of:

```javascript
{
  text: 'A line of text.',
  marks: [{ type: 'bold' }],
}
```

You now have:

```javascript
{
  text: 'A line of text.',
  bold: true,
}
```

And the marks are added and removed from the text nodes using the same `Editor.setNodes` transform that you use for toggling formatting on block and inline nodes. This greatly simplifies things and makes Slate's core even smaller.

**The `<Slate>` component is now a "controlled" component.** This makes things a bit more React-ish, and makes it easier to update the editor's value when new data is received after the initial render. To arrive at the previous "uncontrolled" behavior you'll need to implement it in userland using React's built-in hooks.

Whereas previously you would do:

```jsx
<Slate defaultValue={initialValue}>...</Slate>
```

Now you must manage the value and selection yourself, like:

```jsx
const [value, setValue] = useState(initialValue)
const [selection, setSelection] = useState(null)

<Slate
  value={value}
  selection={selection}
  onChange={(value, selection) => {
    setValue(value)
    setSelection(selection)
  }}
>
  ...
</Slate>
```

## `0.50` — November 27, 2019

### BREAKING

**A complete overhaul.** The Slate codebase has had a complete overhaul and many pieces of its core architecture have been reconsidered from the ground up. There are lots of changes. We recommend re-reading the [Walkthroughs](https://docs.slatejs.org/walkthroughs) and [Concepts](https://docs.slatejs.org/concepts) documentation and the [Examples](https://github.com/ianstormtaylor/slate/tree/71ff94c8d866a3ad9582ec4b84258d99d508fd70/site/examples/README.md) to get a sense for everything that has changed. As well as the [Migration](https://docs.slatejs.org/concepts/XX-migrating) writeup for what the major changes are.

> ⚠ **Warning:** Changes past this point refer to the older Slate architecture, based on Immutable.js and without TypeScript. Many things are different in the older architecture and may not apply to the newer one.

## `0.47` — May 8, 2019

### NEW

**Introducing the `Annotation` model.** This is very similar to what used to be stored in `value.decorations`, except they also contain a unique "key" to be identified by. They can be used for things like comments, suggestions, collaborative cursors, etc.

```javascript
{
  object: 'annotation',
  key: String,
  type: String,
  data: Map,
  anchor: Point,
  focus: Point,
}
```

**There are three new `*_annotation` operations.** The set of operations now includes `add_annotation`, `remove_annotation` and `set_annotation`. They are similar to the existing `*_mark` operations.

**Introducing "iterable" model methods.** This introduces several iteratable-producing methods on the `Element` interface, which `Document`, `Block` and `Inline` all implement. There are iterables for traversing the entire tree:

```javascript
element.blocks(options)
element.descendants(options)
element.inlines(options)
element.texts(options)

element.ancestors(path, options)
element.siblings(path, options)
```

You can use them just like the native JavaScript iterables. For example, you can loop through the text nodes after a specific node:

```javascript
for (const next of document.texts({ path: start.path })) {
  const [node, path] = next
  // do something with the text node or its path
}
```

Or you can traverse all of the "leaf" blocks:

```javascript
for (const [block] of document.blocks({ onlyLeaves: true })) {
  // ...
}
```

And because these iterations use native `for/of` loops, you can easily `break` or `return` out of the loops directly—a much nicer DX than remembering to `return false`.

### BREAKING

**The `value.decorations` property is now `value.annotations`.** Following with the split of decorations into annotations, this property was also renamed. They must now contain unique `key` properties, as they are stored as a `Map` instead of a `List`. This allows for much more performant updates.

**The `Decoration` model no longer has a nested `mark` property.** Previously a real `Mark` object was used as a property on decorations, but now the `type` and `data` properties are first class properties instead.

```javascript
{
  object: 'decoration',
  type: String,
  data: Map,
  anchor: Point,
  focus: Point,
}
```

## `0.46` — May 1, 2019

### BREAKING

**Mark operations no longer have `offset` or `length` properties.** Since text nodes now contain a unique set of marks, it wouldn't make sense for a single mark-related operation to result in a splitting of nodes. Instead, when a mark is added to only part of a text node, it will result in a `split_node` operation as well as an `add_mark` operation.

**Text operations no longer have a `marks` property.** Previously it was used to add text with a specific set of marks. However this is no longer necessary, and when text is added with marks it will result in an `insert_text` operation as well as an `add_mark` operation.

**Using `Text.create` or `Text.createList` with a `leaves` property will error.** Now that text nodes no longer have leaves, you will need to pass in the `text` string and `marks` directly when creating a new text node. \(However, you can still create entire values using `Value.create` in a backwards compatible way for convenience while migrating.\)

```javascript
// This works, although deprecated, which is the common case...
Value.create(oldValueJson)

// ...but this will error!
Text.create(oldTextJson)
```

**`Value.toJSON` returns the new data model format, without leaves.** Although `Value.fromJSON` and `Value.create` allow the old format in deprecated mode, calling `Value.toJSON` will return the new data format. If you still need the old one you'll need to iterate the document tree converting text nodes yourself.

**The low-level `Value.*` and `Node.*` mutation methods have changed.** These changes follow the operation signature changes, since the methods take the same arguments as the operations themselves. For example:

```javascript
// Previously...
value.addMark(path, offset, length, mark)

// ...is now:
value.addMark(path, mark)
```

These are low-level methods, so this change shouldn't affect the majority of use cases.

### DEPRECATED

**Initializing editors with `Text` nodes with a `leaves` property is deprecated.** In this new version of Slate, creating a new value with `Value.create` with the old leaf data model is still allowed for convenience in migration, but it will be removed in a coming version. \(However, using the low-level `Text.create` will throw an error!\)

```javascript
// This works, although deprecated, which is the common case...
Value.create(oldValueJson)

// ...but this will error!
Text.create(oldTextJson)
```

## `0.45` — April 2, 2019

### BREAKING

**A few properties of `Operation` objects have changed.** In an effort to standardize and streamline operations, their properties have changed. This **won't** affect 90% of use cases, since operations are usually low-level concerns. However, if you are using operational transform or some other low-level parts of Slate, this may affect you. The `value`, `selection`, `node`, and `mark` properties—which contained references to Immutable.js objects—have all been removed. In their place, we have standardized a `properties` and `newProperties` pair. This will greatly reduce the size of operations stored in memory, and makes dealing with them easier when serialized as well.

## `0.44` — November 8, 2018

### NEW

**Introducing the `child_min_invalid` and `child_max_invalid` schema errors.** These new schema errors map directly to the `mix` and `max` schema rule definitions, and make it easier to determine exactly what your normalization logic needs to do to fix the document.

**Added new node retrieval methods.** There are three new methdos for node retrieval. The first is `getNodesAtRange` which will retrieve _all_ of the nodes in the tree in a given range. And the second two are `getRootBlocksAtRange` and `getRootInlinesAtRange` for retrieving the top-most blocks or inlines in a given range. These should be helpful in defining your own command logic.

### BREAKING

**Schema errors for `min` and `max` rules have changed.** Previously they would result in errors of `child_required`, `child_object_invalid`, `child_type_invalid` and `child_unknown`. Now that we have the new `child_min_invalid` and `child_max_invalid` errors, these schema rules will return them instead, making it much easier to determine exactly which rule is causing a schema error.

### DEPRECATED

**The `getBlocksAtRange` and `getInlinesAtRange` methods have been renamed.** To clear up confusion about which blocks and inlines are retrieve in the case of nesting, these two methods have been renamed to `getLeafBlocksAtRange` and `getLeafInlinesAtRange` to clarify that they retrieve the bottom-most nodes. And now there are two additional methods called `getRootBlocksAtRange` and `getRootInlinesAtRange` for cases where you want the top-most nodes instead.

## `0.43` — October 27, 2018

### NEW

**The `editor.command` and `editor.query` methods can take functions.** Previously they only accepted a `type` string and would look up the command or query by type. Now, they also accept a custom function. This is helpful for plugin authors, who want to accept a "command option", since it gives users more flexibility to write one-off commands or queries. For example a plugin could be passed either:

```javascript
Hotkey({
  hotkey: 'cmd+b',
  command: 'addBoldMark',
})
```

Or a custom command function:

```javascript
Hotkey({
  hotkey: 'cmd+b',
  command: editor => editor.addBoldMark().moveToEnd(),
})
```

### BREAKING

**The `Change` object has been removed.** The `Change` object as we know it previously has been removed, and all of its behaviors have been folded into the `Editor` controller. This includes the top-level commands and queries methods, as well as methods like `applyOperation` and `normalize`. _All places that used to receive `change` now receive `editor`, which is API equivalent._

**Changes are now flushed to `onChange` asynchronously.** Previously this was done synchronously, which resulted in some strange race conditions in React environments. Now they will always be flushed asynchronously, just like `setState`.

**The `normalize*` and `validate*` middleware signatures have changed!** Previously the `normalize*` and `validate*` middleware was passed `(node, next)`. However now, for consistency with the other middleware they are all passed `(node, editor, next)`. This way, all middleware always receive `editor` and `next` as their final two arguments.

**The `editor.event` method has been removed.** Previously this is what you'd use when writing tests to simulate events being fired—which were slightly different to other running other middleware. With the simplification to the editor and to the newly-consistent middleware signatures, you can now use `editor.run` directly to simulate events:

```javascript
editor.run('onKeyDown', { key: 'Tab', ... })
```

### DEPRECATED

**The `editor.change` method is deprecated.** With the removal of the `Change` object, there's no need anymore to create the small closures with `editor.change()`. Instead you can directly invoke commands on the editor in series, and all of the changes will be emitted asynchronously on the next tick.

```javascript
editor
  .insertText('word')
  .moveFocusForward(10)
  .addMark('bold')
```

**The `applyOperations` method is deprecated.** Instead you can loop a set of operations and apply each one using `applyOperation`. This is to reduce the number of methods exposed on the `Editor` to keep it simpler.

**The `change.call` method is deprecated.** Previously this was used to call a one-off function as a change method. Now this behavior is equivalent to calling `editor.command(fn)` instead.

## `0.42` — October 9, 2018

### NEW

**Introducing the `Editor` controller.** Previously there was a vague `editor` concept, that was the React component itself. This was helpful, but because it was tightly coupled to React and the browser, it didn't lend itself to non-browser use cases well. This meant that the line between "model" and "controller/view" was blurred, and some concepts lived in both places at once, in inconsistent ways.

A new `Editor` controller now makes this relationship clear. It borrows many of its behaviors from the React `<Editor>` component. And the component actually just instantiates its own plain JavaScript `Editor` under the covers to delegate the work to.

This new concept powers a lot of the thinking in this new version, unlocking a lot of changes that bring a clearer separation of responsibilities to Slate. It allows us to create editors in any environment, which makes server-side use cases easier, brings parity to testing, and even opens us up to supporting other view layers like React Native or Vue.js in the future.

It has a familiar API, based on the existing `editor` concept:

```javascript
const editor = new Editor({ plugins, value, onChange })

editor.change(change => {
  ...
})
```

However it also introduces imperative methods to make testing easier:

```javascript
editor.run('renderNode', props)

editor.event('onKeyDown', event)

editor.command('addMark', 'bold')

editor.query('isVoid', node)
```

I'm very excited about it, so I hope you like it!

**Introducing the "commands" concept.** Previously, "change methods" were treated in a first-class way, but plugins had no easy way to add their own change methods that were reusable elsewhere. And they had no way to override the built-in logic for certain commands, for example `splitBlock` or `insertText`. However, now this is all customizable by plugins, with the core Slate plugin providing all of the previous default commands.

```javascript
const plugin = {
  commands: {
    wrapQuote(change) {
      change.wrapBlock('quote')
    },
  },
}
```

Those commands are then available directly on the `change` objects, which are now editor-specific:

```javascript
change.wrapQuote()
```

This allows you to define all of your commands in a single, easily-testable place. And then "behavioral" plugins can simply take command names as options, so that you have full control over the logic they trigger.

**Introducing the "queries" concept.** Similarly to the commands, queries allow plugins to define specific behaviors that the editor can be queried for in a reusable way, to be used when rendering buttons, or deciding on command behaviors, etc.

For example, you might define an `getActiveList` query:

```javascript
const plugin = {
  queries: {
    getActiveList(editor) {},
  },
}
```

And then be able to re-use that logic easily in different places in your codebase, or pass in the query name to a plugin that can use your custom logic itself:

```javascript
const list = change.getActiveList()

if (list) {
  ...
} else {
  ...
}
```

Taken together, commands and queries offer a better way for plugins to manage their inter-dependencies. They can take in command or query names as options to change their behaviors, or they can export new commands and queries that you can reuse in your codebase.

**The middleware stack is now deferrable.** With the introduction of the `Editor` controller, the middleware stack in Slate has also been upgraded. Each middleware now receives a `next` function \(similar to Express or Koa\) that allows you to choose whether to iterating the stack or not.

```javascript
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

```javascript
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

```javascript
const plugin = {
  onCommand(command, editor, next) {
    ...
  }
}
```

This allows you to actually listen in to all commands, and override individual behaviors if you choose to do so, without having to override the command itself. This is a very advanced feature, which most people won't need, but it shows the flexibility provided by migrating all of the previously custom internal logic to be based on the new middleware stack.

**Plugins can now be defined in nested arrays.** This is a small addition, but it means that you no longer need to differentiate between individual plugins and multiple plugins in an array. This allows plugins to be more easily composed up from multiple other plugins themselves, without the end user having to change how they use them. Small, but encourages reuse just a little bit more.

### DEPRECATED

**The `slate-simulator` is deprecated.** Previously this was used as a pseudo-controller for testing purposes. However, now with the new `Editor` controller as a first-class concept, everything the simulator could do can now be done directly in the library. This should make testing in non-browser environments much easier to do.

### BREAKING

**The `Value` object is no longer tied to changes.** Previously, you could create a new `Change` by calling `value.change()` and retrieve a new value. With the re-architecture to properly decouple the schema, commands, queries and plugins from the core Slate data models, this is no longer possible. Instead, changes are always created via an `Editor` instance, where those concepts live.

```javascript
// Instead of...
const { value } = this.state
const change = value.change()
...
this.onChange(change)

// You now would do...
this.editor.change(change => {
  const { value } = change
  ...
})
```

Sometimes this means you will need to store the React `ref` of the `editor` to be able to access its `editor.change` method in your React components.

**Remove the `Stack` "model", in favor of the new `Editor`.** Previously there was a pseudo-model called the `Stack` that was very low level, and not really a model. This concept has now been rolled into the new `Editor` controller, which can be used in any environment because it's just plain JavaScript. There was almost no need to directly use a `Stack` instance previously, so this change shouldn't affect almost anyone.

**Remove the `Schema` "model", in favor of the new `Editor`.** Previously there was another pseudo-model called the `Schema`, that was used to contain validation logic. All of the same validation features are still available, but the old `Schema` model is now rolled into the `Editor` controller as well, in the form of an internal `SchemaPlugin` that isn't exposed.

**Remove the `schema.isVoid` and `schema.isAtomic` in favor of queries.** Previously these two methods were used to query the schema about the behavior of a specific `node` or `decoration`. Now these same queries as possible using the "queries" concept, and are available directly on the `change` object:

```javascript
if (change.isVoid(node)) {
  ...
}
```

**The middleware stack must now be explicitly continued, using `next`.** Previously returning `undefined` from a middleware would \(usually\) continue the stack onto the next middleware. Now, with middleware taking a `next` function argument you must explicitly decide to continue the stack by call `next()` yourself.

**Remove the `History` model, in favor of commands.** Previously there was a `History` model that stored the undo/redo stacks, and managing saving new operations to those stacks. All of this logic has been folded into the new "commands" concept, and the undo/redo stacks now live in `value.data`. This has the benefit of allowing the history behavior to be completely overridable by userland plugins, which was not an easy feat to manage before.

**Values can no longer be normalized on creation.** With the decoupling of the data model and the plugin layer, the schema rules are no longer available inside the `Value` model. This means that you can no longer receive a "normalized" value without having access to the `Editor` and its plugins.

```javascript
// While previously you could attach a `schema` to a value...
const normalized = Value.create({ ..., schema })

// Now you'd need to do that with the `editor`...
const value = Value.create({ ... })
const editor = new Editor({ value, plugins: [{ schema }] })
const normalized = editor.value
```

While this seems inconvenient, it makes the boundaries in the API much more clear, and keeps the immutable and mutable concepts separated. This specific code sample gets longer, but the complexities elsewhere in the library are removed.

**The `Change` class is no longer exported.** Changes are now editor-specific, so exporting the `Change` class no longer makes sense. Instead, you can use the `editor.change()` API to receive a new change object with the commands and queries specific to your editor's plugins.

**The `getClosestVoid`, `getDecorations` and `hasVoidParent` method now take an `editor`.** Previously these `Node` methods took a `schema` argument, but this has been replaced with the new `editor` controller instead now that the `Schema` model has been removed.

## `0.41` — September 21, 2018

### DEPRECATED

**The `withoutNormalization` helper has been renamed to `withoutNormalizing`.** This is to stay consistent with the new helpers for `withoutSaving` and `withoutMerging`.

### BREAKING

**The the "operation flags" concept was removed.** This was a confusing concept that was implemented in multiple different ways and led to the logic around normalizing, saving, and merging operations being more complex than it needed to be. These flags have been replaced with three simpler helper functions: `withoutNormalizing`, `withoutSaving` and `withoutMerging`.

```javascript
change.withoutNormalizing(() => {
  nodes.forEach(node => change.removeNodeByKey(node.key))
})
```

```javascript
change.withoutSaving(() => {
  change.setValue({ decorations })
})
```

This means that you no longer use the `{ normalize: false }` or `{ save: false }` options as arguments to individual change methods, and instead use these new helper methods to apply these behaviors to groups of changes at once.

**The "normalize" change methods have been removed.** Previously there were a handful of different normalization change methods like `normalizeNodeByPath`, `normalizeParentByKey`, etc. These were confusing because it put the onus on the implemented to know exact which nodes needed to be normalized. They have been removed, and implementers no longer ever need to worry about which specific nodes to normalize, as Slate will handle that for them.

**The internal `refindNode` and `refindPath` methods were removed.** These should never have been exposed in the first place, and are now no longer present on the `Element` interface. These were only used internally during the normalization process.

## `0.40` — August 22, 2018

### BREAKING

**Remove all previously deprecated code paths.** This helps to reduce some of the complexity in Slate by not having to handle these code paths anymore. And it helps to reduce file size. When upgrading, it's _highly_ recommended that you upgrade to the previous version first and ensure there are no deprecation warnings being logged, then upgrade to this version.

## `0.39` — August 22, 2018

### NEW

**Introducing the `Range` model** _**and**_ **interface.** Previously the "range" concept was used in multiple different places, for the selection, for decorations, and for acting on ranges of the document. This worked okay, but it was hiding the underlying system which is that `Range` is really an interface that other models can choose to implement. Now, we still use the `Range` model for referencing parts of the document, but it can also be implemented by other models that need to attach more semantic meaning...

**Introducing the `Decoration` and `Selection` models.** These two new models both implement the new `Range` interface. Where previously they had to mis-use the `Range` model itself with added semantics. This just cleans up some of the confusion around overlapping properties, and allows us to add even more domain-specific methods and properties in the future without trouble.

### BREAKING

**Decorations have changed!** Previously, decorations piggybacked on the `Range` model, using the existing `marks` property, and introducing their own `isAtomic` property. However, they have now been split out into their own `Decoration` model with a single `mark` and with the `isAtomic` property controlled by the schema. What previously would have looked like:

```javascript
Range.create({
  anchor: { ... },
  focus: { ... },
  marks: [{ type: 'highlight' }],
  isAtomic: true,
})
```

Is now:

```javascript
Decoration.create({
  anchor: { ... },
  focus: { ... },
  mark: { type: 'highlight' },
})
```

Each decoration maps to a single `mark` object. And the atomicity of the mark controlled in the schema instead, for example:

```javascript
const schema = {
  marks: {
    highlight: {
      isAtomic: true,
    },
  },
}
```

**The `Range` model has reduced semantics.** Previously, since all decorations and selections were ranges, you could create ranges with an `isFocused`, `isAtomic` or `marks` properties. Now `Range` objects are much simpler, offering only an `anchor` and a `focus`, and can be extended by other models implementing the range interface. However, this means that using `Range.create` or `document.createRange` might not be what you want anymore. For example, for creating a new selection, you used to use:

```javascript
const selection = document.createRange({
  isFocused: true,
  anchor: { ... },
  focus: { ... },
})
```

But now, you'll need to use `document.createSelection` instead:

```javascript
const selection = document.createSelection({
  isFocused: true,
  anchor: { ... },
  focus: { ... },
})
```

**The `value.decorations` property is no longer nullable.** Previously when no decorations were applied to the value, the `decorations` property would be set to `null`. Now it will be an empty `List` object, so that the interface is more consistent.

### DEPRECATED

**The `Node.createChildren` static method is deprecated.** This was just an alias for `Node.createList` and wasn't necessary. You can use `Node.createList` going forward for the same effect.

**The `renderPortal` property of plugins is deprecated.** This allows `slate-react` to be slightly slimmer, since this behavior can be handled in React 16 with the new `<React.Fragment>` using the `renderEditor` property instead, in a way that offers more control over the portal behavior.

**The `data` property of plugins is deprecated.** This property wasn't well designed and circumvented the core tenet that all changes to the `value` object will flow through operations inside `Change` objects. It was mostly used for view-layer state which should be handled with React-specific conventions for state management instead.

## `0.38` — August 21, 2018

### DEPRECATED

**`Node.isVoid` access is deprecated.** Previously the "voidness" of a node was hardcoded in the data model. Soon it will be determined at runtime based on your editor's schema. This deprecation just ensures that you aren't using the `node.isVoid` property which will not work in future verisons. What previously would have been:

```javascript
if (node.isVoid) {
  ...
}
```

Now becomes:

```javascript
if (schema.isVoid(node)) {
  ...
}
```

This requires you to have a reference to the `schema` object, which can be access as `value.schema`.

**`Value.isFocused/isBlurred` and `Value.hasUndos/hasRedos` are deprecated.** These properties are easily available via `value.selection` and `value.history` instead, and are now deprecated to reduce the complexity and number of different ways of doing things.

## `0.37` — August 3, 2018

### NEW

**Introducing the `Point` model.** Ranges are now built up of two `Point` models—an `anchor` and a `focus`—instead of having the properties set directly on the range itself. This makes the "point" concept first-class in Slate and better API's can be built around point objects.

```javascript
Point.create({
  key: 'a',
  path: [0, 0],
  offset: 31,
})
```

These points are exposed on `Range` objects via the `anchor`, `focus`, `start` and `end` properties:

```javascript
const { anchor, focus } = range
change.removeNodeByKey(anchor.key)
```

These replace the earlier `anchorKey`, `anchorOffset`, etc. properties.

**`Document.createRange` creates a relative range.** Previously you'd have to use `Range.create` and make sure that you passed valid arguments, and ensure that you "normalized" the range to sync its keys and paths. This is no longer the case, since the `createRange` method will do it for you.

```javascript
const range = document.createRange({
  anchor: {
    key: 'a',
    offset: 1,
  },
  focus: {
    key: 'a',
    offset: 4,
  },
})
```

This will automatically ensure that the range references leaf text nodes, and that its `anchor` and `focus` paths are set.

**`Document.createPoint` creates a relative point.** Just like the `createRange` method, `createPoint` will create a point that is guaranteed to be relative to the document itself. This is often a lot easier than using `Point.create` directly.

```javascript
const anchor = document.createPoint({
  key: 'a',
  offset: 1,
})
```

### BREAKING

**The `Range.focus` method was removed. \(Not `Change.focus`!\)** This was necessary to make way for the new `range.focus` point property. Usually this would have been done in a migration-friendly way like the rest of the method changes in this release, but this was an exception. However the `change.focus()` method is still available and works as expected.

**`Range.set` and `Range.merge` are dangerous.** If you were previously using the super low-level Immutable.js methods `range.set` or `range.merge` with any of the now-removed properties of ranges, these invocations will fail. Instead, you should use the `range.set*` helpers going forward which can be migrated with deprecations warnings instead of failing outright.

**The `offset` property of points defaults to `null`.** Previously it would default to `0` but that could be confusing because it made no distinction from a "set" or "unset" offset. Now they default to `null` instead. This shouldn't really affect any real-world usage of Slate.

**The `Range.toJSON()` structure has changed.** With the introduction of points, the range now returns its `anchor` and `focus` properties as nested point JSON objects instead of directly as properties. For example:

```javascript
{
  "object": "range",
  "anchor": {
    "object": "point",
    "key": "a",
    "offset": 1,
    "path": [0, 0]
  },
  "focus": {
    "object": "point",
    "key": "a",
    "offset": 3,
    "path": [0, 0]
  },
  "isAtomic": false,
  "isFocused": false,
  "marks": []
}
```

### DEPRECATED

**The selection-based shorts on `Value` were deprecated.** Previously you could access things like `anchorKey`, `startOffset` and `isCollapsed` directly on `Value` objects. This results in extra duplication that is hard to maintain over time, and hard for newcomers to understand, without much benefit. All of these properties are deprecated and should be accessed on the `value.selection` object directly instead.

**The `Range` methods were standardized, with many deprecated.** The methods on `Range` objects had grown drastically in size. Many of them weren't consistently named, or overlapped in unnecessary ways. With the introduction of `Point` objects a lot of these methods could be cleaned up and their logic delegated to the points directly. All of these methods remain available but will raise deprecation warnings, making it easier to upgrade.

_There's a very good chance you're only using a handful of them in your codebase. Either way, all of them will log warnings. For an example of migrating see_ [_this commit_](https://github.com/ianstormtaylor/slate/pull/2035/commits/1bc560ab6242bc015c9f6d3bd20086f18849f8b7)_._

Here's a full list of the newly deprecated methods and properties, and their new alternative if one exists:

```text
anchorKey -> anchor.key
anchorOffset -> anchor.offset
anchorPath -> anchor.path
blur -> setIsFocused
collapseTo -> moveTo
collapseToAnchor -> moveToAnchor
collapseToEnd -> moveToEnd
collapseToEndOf -> moveToEndOfNode
collapseToFocus -> moveToFocus
collapseToStart -> moveToStart
collapseToStartOf -> moveToStartOfNode
deselect -> Range.create
endKey -> end.key
endOffset -> end.offset
endPath -> end.path
extend -> moveFocus
extendTo -> moveFocusTo
extendToEndOf -> moveFocusToEndOfNode
extendToStartOf -> moveFocusToStartOfNode
focusKey -> focus.key
focusOffset -> focus.offset
focusPath -> focus.path
hasAnchorAtEndOf -> anchor.isAtEndOfNode
hasAnchorAtStartOf -> anchor.isAtStartOfNode
hasAnchorBetween ->
hasAnchorIn -> anchor.isInNode
hasEdgeAtEndOf -> anchor.isAtEndOfNode || focus.isAtEndOfNode
hasEdgeAtStartOf -> anchor.isAtStartOfNode || focus.isAtStartOfNode
hasEdgeBetween ->
hasEdgeIn -> anchor.isInNode || focus.isInNode
hasEndAtEndOf -> end.isAtEndOfNode
hasEndAtStartOf -> end.isAtEndOfNode
hasEndBetween ->
hasEndIn -> end.isInNode
hasFocusAtEndOf -> focus.isAtEndOfNode
hasFocusAtStartOf -> focus.isAtStartOfNode
hasFocusBetween ->
hasFocusIn -> focus.isInNode
hasStartAtEndOf -> start.isAtEndOfNode
hasStartAtStartOf -> start.isAtStartOfNode
hasStartBetween ->
hasStartIn -> start.isInNode
isAtEndOf -> isCollapsed && anchor.isAtEndOfNode
isAtStartOf -> isCollapsed && anchor.isAtStartOfNode
move -> moveForward/Backward
moveAnchor -> moveAnchorForward/Backward
moveAnchorOffsetTo -> moveAnchorTo
moveAnchorOffsetTo -> moveAnchorTo
moveAnchorToEndOf -> moveAnchorToEndOfNode
moveAnchorToStartOf -> moveAnchorToStartOfNode
moveEnd -> moveEndForward/Backward
moveEndOffsetTo -> moveEndTo
moveFocus -> moveFocusForward/Backward
moveFocusOffsetTo -> moveFocusTo
moveFocusOffsetTo -> moveFocusTo
moveFocusToEndOf -> moveFocusToEndOfNode
moveFocusToStartOf -> moveFocusToStartOfNode
moveOffsetsTo -> moveAnchorTo && moveFocusTo
moveStart -> moveStartForward/Backward
moveStartOffsetTo -> moveStartTo
moveToEndOf -> moveToEndOfNode
moveToRangeOf -> moveToRangeOfNode
moveToStartOf -> moveToStartOfNode
startKey -> start.key
startOffset -> start.offset
startPath -> start.path
```

**The selection-based changes were standardized, with many deprecated.** Similarly to the `Range` method deprecations, the same confusion and poor naming choices existed in the `Change` methods that dealt with selections. Many of them have been renamed for consistency, or deprecated when alternatives existed. All of these methods remain available but will raise deprecation warnings, making it easier to upgrade.

_There's a very good chance you're only using a handful of these change methods in your codebase. Either way, all of them will log warnings. For an example of migrating see_ [_this commit_](https://github.com/ianstormtaylor/slate/pull/2035/commits/1bc560ab6242bc015c9f6d3bd20086f18849f8b7)_._

Here's a full list of the newly deprecated changed methods, and their new alternative if one exists:

```text
collapseCharBackward -> moveBackward
collapseCharForward -> moveForward
collapseLineBackward -> moveToStartOfBlock
collapseLineForward -> moveToEndOfBlock
collapseTo -> moveTo
collapseToAnchor -> moveToAnchor
collapseToEnd -> moveToEnd
collapseToEndOf -> moveToEndOfNode
collapseToEndOfBlock -> moveToEndOfBlock
collapseToEndOfNextBlock -> moveToEndOfNextBlock
collapseToEndOfNextText -> moveToEndOfNextText
collapseToEndOfPreviousBlock -> moveToEndOfPreviousBlock
collapseToEndOfPreviousText -> moveToEndOfPreviousText
collapseToFocus -> moveToFocus
collapseToStart -> moveToStart
collapseToStartOf -> moveToStartOfNode
collapseToStartOfBlock -> moveToStartOfBlock
collapseToStartOfNextBlock -> moveToStartOfNextBlock
collapseToStartOfNextText -> moveToStartOfNextText
collapseToStartOfPreviousBlock -> moveToStartOfPreviousBlock
collapseToStartOfPreviousText -> moveToStartOfPreviousText
extend -> moveFocusForward/Backward
extendCharBackward -> moveFocusBackward
extendCharForward -> moveFocusForward
extendLineBackward -> moveFocusToStartOfBlock
extendLineForward -> moveFocusToEndOfBlock
extendTo -> moveFocusTo
extendToEndOf -> moveFocusToEndOfNode
extendToEndOfBlock -> moveFocusToEndOfBlock
extendToEndOfNextBlock -> moveFocusToEndOfNextBlock
extendToEndOfNextInline -> moveFocusToEndOfNextInline
extendToEndOfNextText -> moveFocusToEndOfNextText
extendToEndOfPreviousBlock -> moveFocusToEndOfPreviousBlock
extendToEndOfPreviousInline -> moveFocusToEndOfPreviousInline
extendToEndOfPreviousText -> moveFocusToEndOfPreviousText
extendToStartOf -> moveFocusToStartOfNode
extendToStartOfBlock -> moveFocusToStartOfBlock
extendToStartOfNextBlock -> moveFocusToStartOfNextBlock
extendToStartOfNextInline -> moveFocusToStartOfNextInline
extendToStartOfNextText -> moveFocusToStartOfNextText
extendToStartOfPreviousBlock -> moveFocusToStartOfPreviousBlock
extendToStartOfPreviousInline -> moveFocusToStartOfPreviousInline
extendToStartOfPreviousText -> moveFocusToStartOfPreviousText
move -> moveForward/Backward
moveAnchor -> moveAnchorForward/Backward
moveAnchorCharBackward -> moveAnchorBackward
moveAnchorCharForward -> moveAnchorForward
moveAnchorOffsetTo -> moveAnchorTo
moveAnchorToEndOf -> moveAnchorToEndOfNode
moveAnchorToStartOf -> moveAnchorToEndOfNode
moveCharBackward -> moveBackward
moveCharForward -> moveForward
moveEnd -> moveEndForward/Backward
moveEndCharBackward -> moveEndBackward
moveEndCharForward -> moveEndForward
moveEndOffsetTo -> moveEndTo
moveFocus -> moveFocusForward/Backward
moveFocusCharBackward -> moveFocusBackward
moveFocusCharForward -> moveFocusForward
moveFocusOffsetTo -> moveFocusTo
moveFocusToEndOf -> moveFocusToEndOfNode
moveFocusToStartOf -> moveFocusToEndOfNode
moveOffsetsTo -> moveAnchorTo/moveFocusTo
moveStart -> moveStartForward/Backward
moveStartCharBackward -> moveStartBackward
moveStartCharForward -> moveStartForward
moveStartOffsetTo -> moveStartTo
moveToEndOf -> moveToEndOfNode
moveToRangeOf -> moveToRangeOfNode
moveToStartOf -> moveToStartOfNode
selectAll -> moveToRangeOfDocument
```

## `0.36` — July 27, 2018

### BREAKING

**Schema rules have changed!** To make them able to be used in more cases \(so you don't have to dip down to the slower `validateNode/normalizeNode` function\), the matching syntax for schema rules has changed. Previously multiples types/objects would be expressed as:

```javascript
{
  parent: { types: ['ordered_list', 'unordered_list'] },
}
```

Now there is a new `match` object concept, which looks like:

```javascript
{
  parent: { object: 'block', type: 'list' },
}
```

Match objects can be objects, or an array of objects which acts as `OR`:

```javascript
{
  parent: [{ type: 'ordered_list' }, { type: 'unordered_list' }],
}
```

Additionally, schema rules can now be defined using a `schema.rules` array of objects with top-level match properties. This allows for matching nodes in ways that were previously impossible. For example:

```javascript
{
  schema: {
    rules: [{
      // Match all blocks, regardless of type!
      match: { object: 'block' },
      text: /.../g,
      normalize: () => { ... },
    }]
  }
}
```

All of the shorthands like `schema.blocks` and `schema.inlines` are still available, and are simply rewritten to the more flexible `rules` syntax under the covers. These changes are just a small way of making Slate more flexible for advanced use cases when you run into them.

**Schema rule `normalize` functions now receive `SlateError` objects.** Previously they would be called with a signature of `(change, violation, context)`. They are now called with `(change, error)`. This new error is a `SlateError` object with an `error.code` and all of the same context properties.

A normalizer that previously looked like:

```javascript
{
  normalize: (change, violation, context) {
    if (violation === 'child_type_invalid') {
      const type = index === 0 ? 'title' : 'paragraph'
      return change.setNodeByKey(context.child.key, type)
    }
  }
}
```

Would now look like:

```javascript
{
  normalize: (change, error) {
    if (error.code === 'child_type_invalid') {
      const type = index === 0 ? 'title' : 'paragraph'
      return change.setNodeByKey(error.child.key, type)
    }
  }
}
```

This is just an attempt to make dealing with normalization errors slightly more idiomatic with how errors are represented in most libraries, in order to not reinvent the wheel unnecessarily.

## `0.35` — July 27, 2018

### NEW

**`Range` objects now keep track of paths, in addition to keys.** Previously ranges only stored their points as keys. Now both paths and keys are used, which allows you to choose which one is the most convenient or most performant for your use case. They are kept in sync my Slate under the covers.

**A new set of `*ByPath` change methods have been added.** All of the changes you could previously do with a `*ByKey` change are now also supported with a `*ByPath` change of the same name. The path-based changes are often more performant than the key-based ones.

**Paths are now of type** [**`List`**](https://facebook.github.io/immutable-js/docs/#/List) **instead of array.** See the documentation of [`List`](https://facebook.github.io/immutable-js/docs/#/List) for its differences to array \(`get` method instead of array indexing, `size` instead of `length`, etc\).

### BREAKING

**Internal-yet-public `Node` methods have been changed.** There were a handful of internal methods that shouldn't be used in 99% of Slate implementations that updated or removed. This was done in the process of streamlining many of the `Node` methods to make them more consistent and easier to use. For a list of those affected:

- `Node.assertPath` was changed. It was previously confusingly named because the equivalent `Node.getPath` did something completely different. You should now use `Node.assertNode(path)` if you need this behavior.
- `Node.removeDescendant` was removed. There's no reason you should have been using this, since it was an undocumented and unused method that was left over from a previous version.
- `Node.updateNode`, `Node.insertNode`, `Node.removeNode`, `Node.splitNode` and `Node.mergeNode` mutating methods were changed. All of your changes should be done with operations, so you likely weren't using these internal methods. They have been changed internally to use paths.

### DEPRECATED

**The `setKeyGenerator` and `resetKeyGenerator` helpers are deprecated.** These were previously used to change the default key generation logic. Now you can use the equivalent `KeyUtils.setGenerator` and `KeyUtils.resetGenerator` helpers instead. This follows the new pattern of grouping related utilities into single namespaces, as is the case with the new `PathUtils` and `TextUtils`.

**Internal-yet-public `Node` methods have been deprecated.** There were a handful of internal methods that shouldn't be used in 99% of Slate implementations that were deprecated. For a list of those affected:

- `Node.getKeys` and `Node.getKeysAsArray` were deprecated. If you really need to check the presence of a key, use the new `Node.getKeysToPathsObject` instead.
- `Node.areDescendantsSorted` and `Node.isInRange` were deprecated. These were used to check whether a node was in a range, but this can be done more performantly and more easily with paths now.
- `Node.getNodeAtPath` and `Node.getDescendantAtPath` were deprecated. These were probably not in use by anyone, but if you were using them you can use the existing `Node.getNode` and `Node.getDescendant` methods instead which now take either paths or keys.

## `0.34` — June 14, 2018

### NEW

**Decorations can now be "atomic".** If you set a decoration as atomic, it will be removed when changed, preventing it from entering a "partial" state, which can be useful for some use cases.

### BREAKING

**Text nodes now represent their content as "leaves".** Previously their immutable representation used individual `Character` instance for each character. Now they have changed to group characters into `Leaf` models, which more closely resembles how they are used, and results in a _lot_ fewer immutable object instances floating around. _For most people this shouldn't cause any issues, since this is a low-level aspect of Slate._

### DEPRECATED

**The `Character` model is deprecated.** Although the character concept is still in the repository for now, it is deprecated and will be removed in a future release. Everything it solves can be solved with leaves instead.

## `0.33` — February 21, 2018

### BREAKING

**Void nodes no longer prescribe their text content.** Previously void nodes would automatically normalize their text content to be a single text node containing `' '` an empty string of content. This restriction was removed, so that void nodes can have arbitrary content. You can use this to store information in void nodes in a way that is more consistent with non-void nodes.

### DEPRECATED

**The `setBlock` method has been renamed to `setBlocks`.** This is to make it more clear that it operates on any of the current blocks in the selection, not just a single blocks.

**The `setInline` method has been renamed to `setInlines`.** For the same reason as `setBlocks`, to be clear and stay consistent.

## `0.32` — January 4, 2018

### BREAKING

**The `kind` property of Slate objects has been renamed to `object`.** This is to reduce the confusion over the difference between "kind" and "type" which are practically synonyms. The "object" name was chosen to match the Stripe API, since it seems like a sensible choice and reads much more nicely when looking through JSON.

**All normalization reasons containing `kind` have been renamed too.** Previously there were normalization reason strings like `child_kind_invalid`. These types of strings have been renamed to `child_object_invalid` to stay consistent.

## `0.31` — November 16, 2017

### NEW

**Added a new `Operation` model.** This model is used to store operations for the history stack, and \(de\)serializes them in a consistent way for collaborative editing use cases.

### BREAKING

**Operation objects in Slate are now immutable records.** Previously they were native, mutable JavaScript objects. Now, there's a new immutable `Operation` model in Slate, ensuring that all of the data inside `Value` objects are immutable. And it allows for easy serialization of operations using `operation.toJSON()` for when sending them between editors. This should not affect most users, unless you are relying on changing the values of the low-level Slate operations \(simply reading them is fine\).

**Operation lists in Slate are now immutable lists.** Previously they were native, mutable JavaScript arrays. Now, to keep consistent with other immutable uses, they are immutable lists. This should not affect most users.

## `0.30` — October 27, 2017

### BREAKING

**Remove all previously deprecated code paths.** This helps to reduce some of the complexity in Slate by not having to handle these code paths anymore. And it helps to reduce file size. When upgrading, it's _highly_ recommended that you upgrade to the previous version first and ensure there are no deprecation warnings being logged, then upgrade to this version.

## `0.29` — October 27, 2017

### NEW

**Added the new `Value` model to replace `State`.** The new model is exactly the same, but with a new name. There is also a shimmed `State` model exported that warns when used, to ease migration.

### BREAKING

**The `set_state` operation has been renamed `set_value`**. This shouldn't affect almost anyone, but in the event that you were relying on the low-level operation types you'll need to update this.

### DEPRECATED

**The "state" has been renamed to "value" everywhere.** All of the current references are maintained as deprecations, so you should be able to upgrade and see warnings logged instead of being greeted with a broken editor. This is to reduce the confusion between React's "state" and Slate's editor value, and in an effort to further mimic the native DOM APIs.

## `0.28` — October 25, 2017

### NEW

**`State` objects now have an embedded `state.schema` property.** This new schema property is used to automatically normalize the state as it changes, according to the editor's current schema. This makes normalization much easier.

### BREAKING

**The `Schema` objects in Slate have changed!** Previously, they used to be where you could define normalization rules, define rendering rules, and define decoration rules. This was overloaded, and made other improvements hard. Now, rendering and decorating is done via the newly added plugin functions \(`renderNode`, `renderMark`, `decorateNode`\). And validation is done either via the lower-level `validateNode` plugin function, or via the new `schema` objects.

**The `normalize*` change methods no longer take a `schema` argument.** Previously you had to maintain a reference to your schema, and pass it into the normalize methods when you called them. Since `State` objects now have an embedded `state.schema` property, this is no longer needed.

## `0.27` — October 14, 2017

### BREAKING

**The `Range` model is now called `Leaf`.** This is to disambiguate with the concept of "ranges" that is used throughout the codebase to be synonymous to selections. For example in methods like `getBlocksAtRange(selection)`.

**The `text.ranges` property in the JSON representation is now `text.leaves`.** When passing in JSON with `text.ranges` you'll now receive a deprecation warning in the console in development.

### DEPRECATED

**The `Selection` model is now called `Range`.** This is to make it more clear what a "selection" really is, to make many of the other methods that act on "ranges" make sense, and to more closely parallel the native DOM API for selections and ranges. A mock `Selection` object is still exported with deprecated `static` methods, to make the transition to the new API easier.

**The `Text.getRanges()` method is now `Text.getLeaves()`.** It will still work, and it will return a list of leaves, but you will see a deprecation warning in the console in development.

## `0.26` — October 13, 2017

### BREAKING

**The `decorate` function of schema rules has changed.** Previously, in `decorate` you would receive a text node and the matched node, and you'd need to manually add any marks you wanted to the text node's characters. Now, "decorations" have changed to just be `Selection` objects with marks in the `selection.marks` property. Instead of applying the marks yourself, you simply return selection ranges with the marks to be applied, and Slate will apply them internally. This makes it possible to write much more complex decoration behaviors. Check out the revamped [`code-highlighting`](https://github.com/ianstormtaylor/slate/blob/master/examples/code-highlighting/index.js) example and the new [`search-highlighting`](https://github.com/ianstormtaylor/slate/blob/master/examples/search-highlighting/index.js) example to see this in action.

**The `set_data` operation type has been replaced by `set_state`.** With the new `state.decorations` property, it doesn't make sense to have a new operation type for every property of `State` objects. Instead, the new `set_state` operation more closely mimics the existing `set_mark` and `set_node` operations.

### DEPRECATED

### NEW

**You can now set decorations based on external information.** Previously, the "decoration" logic in Slate was always based off of the text of a node, and would only re-render when that text changed. Now, there is a new `state.decorations` property that you can set via `change.setState({ decorations })`. You can use this to add presentation-only marks to arbitrary ranges of text in the document. Check out the new [`search-highlighting`](https://github.com/ianstormtaylor/slate/blob/master/examples/search-highlighting/index.js) example to see this in action.

**The `setData` change method has been replaced by `setState`.** Previously you would call `change.setData(data)`. But as new `State` properties are introduced it doesn't make sense to need to add new change methods each time. Instead, the new `change.setState(properties)` more closesely mimics the existing `setMarkByKey` and `setNodeByKey`. To achieve the old behavior, you can do `change.setState({ data })`.

**The `preserveStateData` option of `state.toJSON` has changed.** The same behavior is now called `preserveData` instead. This makes it consistent with all of the existing options, and the new `preserveDecorations` option as well.

## `0.25` — September 21, 2017

### BREAKING

**The `insertBlock` change method no longer replaces empty blocks.** Previously if you used `insertBlock` and the selection was in an empty block, it would replace it. Now you'll need to perform that check yourself and use the new `replaceNodeByKey` method instead.

**The `Block.create` and `Inline.create` methods no longer normalize.** Previously if you used one of them to create a block or inline with zero nodes in it, they would automatically add a single empty text node as the only child. This was unexpected in certain situations, and if you were relying on this you'll need to handle it manually instead now.

## `0.24` — September 11, 2017

### NEW

**Slate is now a "monorepo".** Instead of a single package, Slate has been divided up into individual packages so that you can only require what you need, cutting down on file size. In the process, some helpful modules that used to be internal-only are now exposed.

**There's a new `slate-hyperscript` helper.** This was possible thanks to the work on [`slate-sugar`](https://github.com/GitbookIO/slate-sugar), which paved the way.

**The `slate-prop-types` package is now exposed.** Previously this was an internal module, but now you can use it for adding prop types to any components or plugins you create.

**The `slate-simulator` package is now exposed.** Previously this was an internal testing utility, but now you can use it in your own tests as well. It's currently pretty bare bones, but we can add to it over time.

### BREAKING

**`immutable` is now a** _**peer**_ **dependency of Slate.** Previously it was a regular dependency, but this prevented you from bringing your own version, or you'd have duplication. You'll need to ensure you install it!

**The `Html`, `Plain` and `Raw` serializers are broken into new packages.** Previously you'd import them from `slate`. But now you'll import them from `slate-html-serializer` and `slate-plain-serializer`. And the `Raw` serializer that was deprecated is now removed.

**The `Editor` and `Placeholder` components are broken into a new React-specific package.** Previously you'd import them from `slate`. But now you `import { Editor } from 'slate-react'` instead.

## `0.23` — September 10, 2017

### NEW

**Slate models now have `Model.fromJSON(object)` and `model.toJSON()` methods.** These methods operate with the canonical JSON form \(which used to be called "raw"\). This way you don't need to `import` a serializer to retrieve JSON, if you have the model you can serialize/deserialize.

**Models also have `toJS` and `fromJS` aliases.** This is just to match Immutable.js objects, which have both methods. For Slate though, the methods are equivalent.

### BREAKING

**The `isNative` property of `State` has been removed.** Previously this was used for performance reasons to avoid re-rendering, but it is no longer needed. This shouldn't really affect most people because it's rare that you'd be relying on this property to exist.

### DEPRECATED

**The `Raw` serializer is now deprecated.** The entire "raw" concept is being removed, in favor of allowing all models to be able to serialize and deserialize to JSON themselves. Instead of using the `Raw` serializer, you can now use the `fromJSON` and `toJSON` on the models directly.

**The `toRaw` options for the `Plain` and `Html` serializers are now called `toJSON`.** This is to stay symmetrical with the removal of the "raw" concept everywhere.

**The `terse` option for JSON serialization has been deprecated!** This option causes lots of abstraction leakiness because it means there is no one canonical JSON representation of objects. You had to work with either terse or not terse data.

**The `Html` serializer no longer uses the `terse` representation.** This shouldn't actually be an issue for anyone because the main manifestation of this has a deprecation notice with a patch in place for now.

**The `defaultBlockType` of the `Html` serializer is now called `defaultBlock`.** This is just to make it more clear that it supports not only setting the default `type` but also `data` and `isVoid`.

## `0.22` — September 5, 2017

### NEW

**The `state.activeMarks` returns the intersection of marks in the selection.** Previously there was only `state.marks` which returns marks that appeared on _any_ character in the selection. But `state.activeMarks` returns marks that appear on _every_ character in the selection, which is often more useful for implementing standard richtext editor behaviors.

### BREAKING

**The `Plain` serializer now adds line breaks between blocks.** Previously between blocks the text would be joined without any space whatsoever, but this wasn't really that useful or what you'd expect.

**The `toggleMark` transform now checks the intersection of marks.** Previously, toggling would remove the mark from the range if any of the characters in a range didn't have it. However, this wasn't what all other richtext editors did, so the behavior has changed to mimic the standard behavior. Now, if any characters in the selection have the mark applied, it will first be added when toggling.

**The `.length` property of nodes has been removed.** This property caused issues with code like in Lodash that checked for "array-likeness" by simply looking for a `.length` property that was a number.

**`onChange` now receives a `Change` object \(previously named `Transform`\) instead of a `State`.** This is needed because it enforces that all changes are represented by a single set of operations. Otherwise right now it's possible to do things like `state.transform()....apply({ save: false }).transform()....apply()` and result in losing the operation information in the history. With OT, we need all transforms that may happen to be exposed and emitted by the editor. The new syntax looks like:

```javascript
onChange(change) {
  this.setState({ state: change.state })
}

onChange({ state }) {
  this.setState({ state })
}
```

**Similarly, handlers now receive `e, data, change` instead of `e, data, state`.** Instead of doing `return state.transform()....apply()` the plugins can now act on the change object directly. Plugins can still `return change...` if they want to break the stack from continuing on to other plugins. \(Any `!= null` value will break out.\) But they can also now not return anything, and the stack will apply their changes and continue onwards. This was previously impossible. The new syntax looks like:

```javascript
function onKeyDown(e, data, change) {
  if (data.key == 'enter') {
    return change.splitBlock()
  }
}
```

**The `onChange` and `on[Before]Change` handlers now receive `Change` objects.** Previously they would also receive a `state` object, but now they receive `change` objects like the rest of the plugin API.

**The `.apply({ save })` option is now `state.change({ save })` instead.** This is the easiest way to use it, but requires that you know whether to save or not up front. If you want to use it inline after already saving some changes, you can use the `change.setOperationFlag('save', true)` flag instead. This shouldn't be necessary for 99% of use cases though.

**The `.undo()` and `.redo()` transforms don't save by default.** Previously you had to specifically tell these transforms not to save into the history, which was awkward. Now they won't save the operations they're undoing/redoing by default.

**`onBeforeChange` is no longer called from `componentWillReceiveProps`,** when a new `state` is passed in as props to the `<Editor>` component. This caused lots of state-management issues and was weird in the first place because passing in props would result in changes firing. **It is now the parent component's responsibility to not pass in improperly formatted `State` objects**.

**The `splitNodeByKey` change method has changed to be shallow.** Previously, it would deeply split to an offset. But now it is shallow and another `splitDescendantsByKey` change method has been added \(with a different signature\) for the deep splitting behavior. This is needed because splitting and joining operations have been changed to all be shallow, which is required so that operational transforms can be written against them.

**Blocks cannot have mixed "inline" and "block" children anymore.** Blocks were implicitly expected to either contain "text" and "inline" nodes only, or to contain "block" nodes only. Invalid case are now normalized by the core schema.

**The shape of many operations has changed.** This was needed to make operations completely invertible without any extra context. The operations were never really exposed in a consumable way, so I won't detail all of the changes here, but feel free to look at the source to see the details.

**All references to "joining" nodes is now called "merging".** This is to be slightly clearer, since merging can only happen with adjacent nodes already, and to have a nicer parallel with "splitting", as in cells. The operation is now called `merge_node`, and the transforms are now `merge*`.

### DEPRECATED

**The `transform.apply()` method is deprecated.** Previously this is where the saving into the history would happen, but it created an awkward convention that wasn't necessary. Now operations are saved into the history as they are created with change methods, instead of waiting until the end. You can access the new `State` of a change at any time via `change.state`.

## `0.21` — July 20, 2017

### BREAKING

**The `Html` serializer now uses `DOMParser` instead of `cheerio`.** Previously, the `Html` serializer used the `cheerio` library for representing elements in the serialization rule logic, but cheerio was a very large dependency. It has been removed, and the native browser `DOMParser` is now used instead. All HTML serialization rules will need to be updated. If you are working with Slate on the server, you can now pass in a custom serializer to the `Html` constructor, using the `parse5` library.

## `0.20` — May 17, 2017

### BREAKING

**Returning `null` from the `Html` serializer skips the element.** Previously, `null` and `undefined` had the same behavior of skipping the rule and trying the rest of the rules. Now if you explicitly return `null` it will skip the element itself.

## `0.19` — March 3, 2017

### BREAKING

**The `filterDescendants` and `findDescendants` methods are now depth-first.** This shouldn't affect almost anyone, since they are usually not the best things to be using for performance reasons. If you happen to have a very specific use case that needs breadth-first, \(or even likely something better\), you'll need to implement it yourself.

### DEPRECATED

**Some `Node` methods have been deprecated!** There were a few methods that had been added over time that were either poorly named that have been deprecated and renamed, and a handful of methods that are no longer useful for the core library that have been deprecated. Here's a full list:

- `areDescendantSorted` -&gt; `areDescendantsSorted`
- `getHighestChild` -&gt; `getFurthestAncestor`
- `getHighestOnlyChildParent` -&gt; `getFurthestOnlyChildAncestor`
- `concatChildren`
- `decorateTexts`
- `filterDescendantsDeep`
- `findDescendantDeep`
- `getChildrenBetween`
- `getChildrenBetweenIncluding`
- `isInlineSplitAtRange`

## `0.18` — March 2, 2017

### BREAKING

**The `plugin.render` property is now called `plugin.renderPortal`.** This is to make way for the new `plugin.render` property that offers HOC-like behavior, so that plugins can augment the editor however they choose.

## `0.17` — February 27, 2017

### DEPRECATED

**Some `Selection` methods have been deprecated!** Previously there were many inconsistencies in the naming and handling of selection changes. This has all been cleaned up, but in the process some methods have been deprecated. Here is a full list of the deprecated methods and their new alternatives:

- `moveToOffsets` -&gt; `moveOffsetsTo`
- `moveForward` -&gt; `move`
- `moveBackward` -&gt; `move`
- `moveAnchorOffset` -&gt; `moveAnchor`
- `moveFocusOffset` -&gt; `moveFocus`
- `moveStartOffset` -&gt; `moveStart`
- `moveEndOffset` -&gt; `moveEnd`
- `extendForward` -&gt; `extend`
- `extendBackward` -&gt; `extend`
- `unset` -&gt; `deselect`

**Some selection transforms have been deprecated!** Along with the methods, the selection-based transforms have also been refactored, resulting in deprecations. Here is a full list of the deprecated transforms and their new alternatives:

- `moveTo` -&gt; `select`
- `moveToOffsets` -&gt; `moveOffsetsTo`
- `moveForward` -&gt; `move`
- `moveBackward` -&gt; `move`
- `moveStartOffset` -&gt; `moveStart`
- `moveEndOffset` -&gt; `moveEnd`
- `extendForward` -&gt; `extend`
- `extendBackward` -&gt; `extend`
- `flipSelection` -&gt; `flip`
- `unsetSelection` -&gt; `deselect`
- `unsetMarks`

## `0.16` — December 2, 2016

### BREAKING

**Inline nodes are now always surrounded by text nodes.** Previously this behavior only occured for inline nodes with `isVoid: true`. Now, all inline nodes will always be surrounded by text nodes. If text nodes don't exist, empty ones will be created. This allows for more consistent behavior across Slate, and parity with other editing experiences.

## `0.15` — November 17, 2016

### BREAKING

**The unique `key` generated values have changed.** Previously, Slate generated unique keys that looked like `'9dk3'`. But they were not very conflict-resistant. Now the keys are simple string of auto-incrementing numbers, like `'0'`, `'1'`, `'2'`. This makes more clear that keys are simply a convenient way to uniquely reference nodes in the **short-term** lifespan of a single in-memory instance of Slate. They are not designed to be used for long-term uniqueness. A new `setKeyGenerator` function has been exported that allows you to pass in your own key generating mechanism if you want to ensure uniqueness.

**The `Raw` serializer doesn't preserve keys by default.** Previously, the `Raw` serializer would omit keys when passed the `terse: true` option, but preserve them without it. Now it will always omit keys, unless you pass the new `preserveKeys: true` option. This better reflects that keys are temporary, in-memory IDs.

**Operations on the document now update the selection when needed.** This won't affect you unless you were doing some very specific things with transforms and updating selections. Overall, this makes it much easier to write transforms, since in most cases, the underlying operations will update the selection as you would expect without you doing anything.

### DEPRECATED

**Node accessor methods no longer accept being passed another node!** Previously, node accessor methods like `node.getParent` could be passed either a `key` string or a `node` object. For performance reasons, passing in a `node` object is being deprecated. So if you have any calls that look like: `node.getParent(descendant)`, they will now need to be written as `node.getParent(descendant.key)`. They will throw a warning for now, and will throw an error in a later version of Slate.

## `0.14` — September 10, 2016

### BREAKING

**The `undo` and `redo` transforms need to be applied!** Previously, `undo` and `redo` were special cased such that they did not require an `.apply()` call, and instead would return a new `State` directly. Now this is no longer the case, and they are just like every other transform.

**Transforms are no longer exposed on `State` or `Node`.** The transforms API has been completely refactored to be built up of "operations" for collaborative editing support. As part of this refactor, the transforms are now only available via the `state.transform()` API, and aren't exposed on the `State` or `Node` objects as they were before.

**`Transform` objects are now mutable.** Previously `Transform` was an Immutable.js `Record`, but now it is a simple constructor. This is because transforms are inherently mutating their representation of a state, but this decision is [up for discussion](https://github.com/ianstormtaylor/slate/issues/328).

**The selection can now be "unset".** Previously, a selection could never be in an "unset" state where the `anchorKey` or `focusKey` was null. This is no longer technically true, although this shouldn't really affect anyone in practice.

## `0.13` — August 15, 2016

### BREAKING

**The `renderNode` and `renderMark` properties are gone!** Previously, rendering nodes and marks happened via these two properties of the `<Editor>`, but this has been replaced by the new `schema` property. Check out the updated examples to see how to define a schema! There's a good chance this eliminates extra code for most use cases! :smile:

**The `renderDecorations` property is gone!** Decoration rendering has also been replaced by the new `schema` property of the `<Editor>`.

## `0.12` — August 9, 2016

### BREAKING

**The `data.files` property is now an `Array`.** Previously it was a native `FileList` object, but needed to be changed to add full support for pasting an dropping files in all browsers. This shouldn't affect you unless you were specifically depending on it being array-like instead of a true `Array`.

## `0.11` — August 4, 2016

### BREAKING

**Void nodes are renderered implicitly again!** Previously Slate had required that you wrap void node renderers yourself with the exposed `<Void>` wrapping component. This was to allow for selection styling, but a change was made to make selection styling able to handled in JavaScript. Now the `<Void>` wrapper will be implicitly rendered by Slate, so you do not need to worry about it, and "voidness" only needs to toggled in one place, the `isVoid: true` property of a node.

## `0.10` — July 29, 2016

### BREAKING

**Marks are now renderable as components.** Previously the only supported way to render marks was by returning a `style` object. Now you can return a style object, a class name string, or a full React component. Because of this, the DOM will be renderered slightly differently than before, resulting in an extra `<span>` when rendering non-component marks. This won't affect you unless you were depending on the DOM output by Slate for some reason.

## `0.9` — July 28, 2016

### BREAKING

**The `wrap` and `unwrap` method signatures have changed!** Previously, you would pass `type` and `data` as separate parameters, for example: `wrapBlock('code', { src: true })`. This was inconsistent with other transforms, and has been updated such that a single argument of `properties` is passed instead. So that example could now be: `wrapBlock({ type: 'code', { data: { src: true }})`. You can still pass a `type` string as shorthand, which will be the most frequent use case, for example: `wrapBlock('code')`.

## `0.8` — July 27, 2016

### BREAKING

**The `onKeyDown` and `onBeforeInput` handlers signatures have changed!** Previously, some Slate handlers had a signature of `(e, state, editor)` and others had a signature of `(e, data, state, editor)`. Now all handlers will be passed a `data` object—which contains Slate-specific data related to the event—even if it is empty. This is helpful for future compatibility where we might need to add data to a handler that previously didn't have any, and is nicer for consistency. The `onKeyDown` handler's new `data` object contains the `key` name, `code` and a series of `is*` properties to make working with hotkeys easier. The `onBeforeInput` handler's new `data` object is empty.

**The `Utils` export has been removed.** Previously, a `Key` utility and the `findDOMNode` utility were exposed under the `Utils` object. The `Key` has been removed in favor of the `data` object passed to `onKeyDown`. And then `findDOMNode` utility has been upgraded to a top-level named export, so you'll now need to access it via `import { findDOMNode } from 'slate'`.

**Void nodes now permanently have `" "` as content.** Previously, they contained an empty string, but this isn't technically correct, since they have content and shouldn't be considered "empty". Now they will have a single space of content. This shouldn't really affect anyone, unless you happened to be accessing that string for serialization.

**Empty inline nodes are now impossible.** This is to stay consistent with native `contenteditable` behavior, where although technically the elements can exist, they have odd behavior and can never be selected.

## `0.7` — July 24, 2016

### BREAKING

**The `Raw` serializer is no longer terse by default!** Previously, the `Raw` serializer would return a "terse" representation of the document, omitting information that wasn't _strictly_ necessary to deserialize later, like the `key` of nodes. By default this no longer happens. You have to opt-in to the behavior by passing `{ terse: true }` as the second `options` argument of the `deserialize` and `serialize` methods.

## `0.6` — July 22, 2016

### BREAKING

**Void components are no longer rendered implicity!** Previously, Slate would automatically wrap any node with `isVoid: true` in a `<Void>` component. But doing this prevented you from customizing the wrapper, like adding a `className` or `style` property. So you **must now render the wrapper yourself**, and it has been exported as `Slate.Void`. This, combined with a small change to the `<Void>` component's structure allows the "selected" state of void nodes to be rendered purely with CSS based on the `:focus` property of a `<Void>` element, which previously [had to be handled in JavaScript](https://github.com/ianstormtaylor/slate/commit/31782cb11a272466b6b9f1e4d6cc0c698504d97f). This allows us to streamline selection-handling logic, improving performance and reducing complexity.

**`data-offset-key` is now `<key>-<index>` instead of `<key>:<start>-<end>`.** This shouldn't actually affect anyone, unless you were specifically relying on that attribute in the DOM. This change greatly reduces the number of re-renders needed, since previously any additional characters would cause a cascading change in the `<start>` and `<end>` offsets of latter text ranges.

## `0.5` — July 20, 2016

### BREAKING

**`node.getTextNodes()` is now `node.getTexts()`.** This is just for consistency with the other existing `Node` methods like `getBlocks()`, `getInlines()`, etc. And it's nicely shorter. :wink:

**`Node` methods now `throw` earlier during unexpected states.** This shouldn't break anything for most folks, unless a strange edge-case was going undetected previously.

## `0.4` — July 20, 2016

### BREAKING

**`renderMark(mark, state, editor)` is now `renderMark(mark, marks, state, editor)`.** This change allows you to render marks based on multiple `marks` presence at once on a given range of text, for example using a custom `BoldItalic.otf` font when text has both `bold` and `italic` marks.

## `0.3` — July 20, 2016

### BREAKING

**`transform.unwrapBlock()` now unwraps selectively.** Previously, calling `unwrapBlock` with a range representing a middle sibling would unwrap _all_ of the siblings, removing the wrapping block entirely. Now, calling it with those same arguments will only move the middle sibling up a layer in the hierarchy, preserving the nesting on any of its siblings. This changes makes it much simpler to implement functionality like unwrapping a single list item, which previously would unwrap the entire list.

## `0.2` — July 18, 2016

### BREAKING

**`transform.mark()` is now `transform.addMark()` and `transform.unmark()` is now `transform.removeMark()`.** The new names make it clearer that the transforms are actions being performed, and it paves the way for adding a `toggleMark` convenience as well.

## `0.1` — July 13, 2016

:tada:
