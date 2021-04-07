# Migrating

Migrating from earlier versions of Slate to the `0.50.x` versions is not a simple task. The entire framework was re-considered from the ground up. This has resulted in a **much** better set of abstractions, which will result in you writing less code. But the migration process is not simple.

It's highly recommended that after reading this guide you read through the original [Walkthroughs](../walkthroughs/01-installing-slate.md) and the other [Concepts](01-interfaces.md) to see how all of the new concepts get applied.

## Major Differences

Here's an overview of the _major_ differences in the `0.50.x` version of Slate from an architectural point of view.

### JSON!

The data model is now comprised of simple JSON objects. Previously, it used [Immutable.js](https://immutable-js.github.io/immutable-js/) data structures. This is a huge change, and one that unlocks many other things. Hopefully it will also increase the average performance when using Slate. It also makes it much easier to get started for newcomers. This will be a large change to migrate from, but it will be worth it.

### Interfaces

The data model is interface-based. Previously each model was an instance of a class. Now, not only is the data plain objects, but Slate only expects that the objects implement an interface. So custom properties that used to live in `node.data` can now live at the top-level of the nodes.

### Namespaces

A lot of helper functions are exposed as a collection of helper functions on a namespace. For example, `Node.get(root, path)` or `Range.isCollapsed(range)`. This ends up making code much clearer because you can always quickly see what interface you're working with.

### TypeScript

The codebase now uses TypeScript. Working with pure JSON as a data model, and using an interface-based API are two things that have been made easier by migrating to TypeScript. You don't need to use it yourself, but if you do you'll get a lot more security when using the APIs. \(And if you use VS Code you'll get nice autocompletion regardless!\)

### Fewer Concepts

The number of interfaces and commands has been reduced. Previously `Selection`, `Annotation`, and `Decoration` used to all be separate classes. Now they are simply objects that implement the `Range` interface. Previously `Block` and `Inline` were separate; now they are objects that implement the `Element` interface. Previously there was a `Document` and `Value`, but now the top-level `Editor` contains the children nodes of the document itself.

The number of commands has been reduced too. Previously we had commands for every type of input, like `insertText`, `insertTextAtRange`, `insertTextAtPath`. These have been merged into a smaller set of more customizable commands, eg. `insertText` which can take `at: Path | Range | Point`.

### Fewer Packages

In an attempt to decrease the maintenance burden, and because the new abstraction and APIs in Slate's core packages make things much easier, the total number of packages has been reduced. Things like `slate-plain-serializer`, `slate-base64-serializer`, etc. have been removed and can be implemented in userland easily if needed. Even the `slate-html-deserializer` can now be implemented in userland \(in ~10 LOC leveraging `slate-hyperscript`\). And internal packages like `slate-dev-environment`, `slate-dev-test-utils`, etc. are no longer exposed because they are implementation details.

### Commands

A new "command" concept has been introduced. \(The old "commands" are now called "transforms".\) This new concept expresses the semantic intent of a user editing the document. And they allow for the right abstraction to tap into user behaviors—for example to change what happens when a user presses enter, or backspace, etc. Instead of using `keydown` events you should likely override command behaviors instead.

Commands are triggered by calling the `editor.*` core functions. And they travel through a middleware-like stack, but built from composed functions. Any plugin can override the behaviors to augment an editor.

### Plugins

Plugins are now plain functions that augment the `Editor` object they receive and return it again. For example, they can augment the command execution by composing the `editor.exec` function or listen to operations by composing `editor.apply`. Previously they relied on a custom middleware stack, and they were just bags of handlers that got merged onto an editor. Now we're using plain old function composition \(aka wrapping\) instead.

### Elements

Block-ness and inline-ness is now a runtime choice. Previously it was baked into the data model with the `object: 'block'` or `object: 'inline'` attributes. Now, it checks whether an "element" is inline or not at runtime. For example, you might check to see that `element.type === 'link'` and treat it as inline.

### More React-ish

Rendering and event-handling are no longer a plugin's concern. Previously plugins had full control over the rendering and event-handling logic in the editor. This creates a bad incentive to start putting **all** rendering logic in plugins, which puts Slate in a position of being a wrapper around all of React, which is very hard to do well. Instead, the new architecture has plugins focused purely on the richtext aspects, and leaves the rendering and event handling aspects to React.

### Context

Previously the `<Editor>` component was doing double duty as a sort of "controller" object and also the `contenteditable` DOM element. This led to a lot of awkwardness in how other components worked with Slate. In the new version, there is a new `<Slate>` context provider and a simpler `<Editable>` `contenteditable`-like component. By putting the `<Slate>` provider higher up in your component tree, you can share the editor directly with toolbars, buttons, etc. using the `useSlate` hook.

### Hooks

In addition to the `useSlate` hook, there are a handful of other hooks. For example the `useSelected` and `useFocused` hooks help with knowing when to render selected states \(often for void nodes\). And since they use React's Context API they will automatically re-render when their state changes.

### `beforeinput`

We now use the `beforeinput` event almost exclusively. Instead of relying on a series of shims and the quirks of React synthetic events, we're now using the standardized `beforeinput` event as our baseline. It is fully supported in Safari and Chrome, will soon be supported in the new Chromium-based Edge, and is currently being worked on in Firefox. In the meantime there are a few patches to make Firefox work. Internet Explorer is no longer supported in core out of the box.

### History-less

The core history logic has now finally been extracted into a standalone plugin. This makes it much easier for people to implement their own custom history behaviors. And it ensures that plugins have enough control to augment the editor in complex ways, because the history requires it.

### Mark-less

Marks have been removed from the Slate data model. Now that we have the ability to define custom properties right on the nodes themselves, you can model marks as custom properties of text nodes. For example bold can be modelled simply as a `bold: true` property.

### Annotation-less

Similarly, annotations have been removed from Slate's core. They can be fully implemented now in userland by defining custom operations and rendering annotated ranges using decorations. But most cases should be using custom text node properties or decorations anyways. There were not that many use cases that benefited from annotations.

## Reductions

One of the goals was to dramatically simplify a lot of the logic in Slate to make it easier to maintain and iterate on. This was done by refactoring to better base abstractions that can be built on, by leveraging modern DOM APIs, and by migrating to simpler React patterns.

To give you a sense for the change in total lines of code:

```text
slate                       8,436  ->  3,958  (47%)
slate-react                 3,905  ->  1,954  (50%)

slate-base64-serializer        38  ->      0
slate-dev-benchmark           340  ->      0
slate-dev-environment         102  ->      0
slate-dev-test-utils           44  ->      0
slate-history                   0  ->    211
slate-hotkeys                  62  ->      0
slate-html-serializer         253  ->      0
slate-hyperscript             447  ->    345
slate-plain-serializer         56  ->      0
slate-prop-types               62  ->      0
slate-react-placeholder        62  ->      0

total                      13,807  ->  6,468  (47%)
```

It's quite a big difference! And that doesn't even include the dependencies that were shed in the process too.
