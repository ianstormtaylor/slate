# Transforms

Slate's data structure is immutable, so you can't modify or delete nodes directly. Instead, Slate comes with a collection of "transform" functions that let you change your editor's value.

Slate's transform functions are designed to be very flexible, to make it possible to represent all kinds of changes you might need to make to your editor. However, that flexibility can be hard to understand at first.

Typically, you'll apply a single operation to zero or more Nodes. For example, here's how you flatten the syntax tree,
by applying `unwrapNodes` to every parent of block Elements:

```js
Transforms.unwrapNodes(editor, {
  at: [], // Path of Editor
  match: node =>
    !Editor.isEditor(node) &&
    node.children?.every(child => Editor.isBlock(editor, child)),
  mode: 'all', // also the Editor's children
})
```

Non-standard operations (or debugging/tracing which Nodes will be affected by a set of NodeOptions) may require using
`Editor.nodes` to create a JavaScript Iterator of NodeEntries and a for..of loop to act.
For example, to replace all image elements with their alt text:

```js
const imageElmnts = Editor.nodes(editor, {
  at: [], // Path of Editor
  match: (node, path) => 'image' === node.type,
  // mode defaults to "all", so this also searches the Editor's children
})
for (const nodeEntry of imageElmnts) {
  const altText =
    nodeEntry[0].alt ||
    nodeEntry[0].title ||
    /\/([^/]+)$/.exec(nodeEntry[0].url)?.[1] ||
    '☹︎'
  Transforms.select(editor, nodeEntry[1])
  Editor.insertFragment(editor, [{ text: altText }])
}
```

> 🤖 Check out the [Transforms](../api/transforms.md) reference for a full list of Slate's transforms.

## Selection Transforms

Selection-related transforms are some of the simpler ones. For example, here's how you set the selection to a new range:

```js
Transforms.select(editor, {
  anchor: { path: [0, 0], offset: 0 },
  focus: { path: [1, 0], offset: 2 },
})
```

But they can be more complex too.

For example, it's common to need to move a cursor forwards or backwards by varying distances—by character, by word, by line. Here's how you'd move the cursor backwards by three words:

```js
Transforms.move(editor, {
  distance: 3,
  unit: 'word',
  reverse: true,
})
```

> 🤖 For more info, check out the [Selection Transforms API Reference](../api/transforms.md#selection-transforms)

## Text Transforms

Text transforms act on the text content of the editor. For example, here's how you'd insert a string of text as a specific point:

```js
Transforms.insertText(editor, 'some words', {
  at: { path: [0, 0], offset: 3 },
})
```

Or you could delete all of the content in an entire range from the editor:

```js
Transforms.delete(editor, {
  at: {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [1, 0], offset: 2 },
  },
})
```

> 🤖 For more info, check out the [Text Transforms API Reference](../api/transforms.md#text-transforms)

## Node Transforms

Node transforms act on the individual element and text nodes that make up the editor's value. For example you could insert a new text node at a specific path:

```js
Transforms.insertNodes(
  editor,
  {
    text: 'A new string of text.',
  },
  {
    at: [0, 1],
  }
)
```

Or you could move nodes from one path to another:

```js
Transforms.moveNodes(editor, {
  at: [0, 0],
  to: [0, 1],
})
```

> 🤖 For more info, check out the [Node Transforms API Reference](../api/transforms.md#node-transforms)

## The `at` Option

Many transforms act on a specific location in the document. By default, they will use the user's current selection. But this can be overridden with the `at` option.

For example when inserting text, this would insert the string at the user's current cursor:

```js
Transforms.insertText(editor, 'some words')
```

Whereas this would insert it at a specific point:

```js
Transforms.insertText(editor, 'some words', {
  at: { path: [0, 0], offset: 3 },
})
```

The `at` option is very versatile, and can be used to implement more complex transforms very easily. Since it is a `Location` it can always be either a `Path`, `Point`, or `Range`. And each of those types of locations will result in slightly different transformations.

For example, in the case of inserting text, if you specify a `Range` location, the range will first be deleted, collapsing to a single point where your text is then inserted.

So to replace a range of text with a new string you can do:

```js
Transforms.insertText(editor, 'some words', {
  at: {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [0, 0], offset: 3 },
  },
})
```

Or, if you specify a `Path` location, it will expand to a range that covers the entire node at that path. Then, using the range-based behavior it will delete all of the content of the node, and replace it with your text.

So to replace the text of an entire node with a new string you can do:

```js
Transforms.insertText(editor, 'some words', {
  at: [0, 0],
})
```

These location-based behaviors work for all the transforms that take an `at` option. It can be hard to wrap your head around at first, but it makes the API very powerful and capable of expressing many subtly different transforms.

## The `match` Option

Many of the node-based transforms take a `match` function option, which restricts the transform to only apply to nodes for which the function returns `true`. When combined with `at`, `match` can also be very powerful.

For example, consider a basic transform that moves a node from one path to another:

```js
Transforms.moveNodes(editor, {
  at: [2],
  to: [5],
})
```

Although it looks like it simply takes a path and moves it to another place. Under the hood two things are happening…

First, the `at` option is expanded to be a range representing all of the content inside the node at `[2]`. Which might look something like:

```js
at: {
  anchor: { path: [2, 0], offset: 0 },
  focus: { path: [2, 2], offset: 19 }
}
```

Second, the `match` option is defaulted to a function that only matches the specific path, in this case `[2]`:

```js
match: (node, path) => Path.equals(path, [2])
```

Then Slate iterates over the range and moves any nodes that pass the matcher function to the new location. In this case, since `match` is defaulted to only match the exact `[2]` path, that node is moved.

But what if you wanted to move the children of the node at `[2]` instead?

You might consider looping over the node's children and moving them one at a time, but this gets very complex to manage because as you move the nodes the paths you're referring to become outdated.

Instead, you can take advantage of the `at` and `match` options to match all of the children:

```js
Transforms.moveNodes(editor, {
  // This will again be expanded to a range of the entire node at `[2]`.
  at: [2],
  // Matches nodes with a longer path, which are the children.
  match: (node, path) => path.length === 2,
  to: [5],
})
```

Here we're using the same `at` path (which is expanded to a range), but instead of letting it match just that path by default, we're supplying our own `match` function which happens to match only the children of the node.

Using `match` can make representing complex logic a lot simpler.

For example, consider wanting to add a bold mark to any text nodes that aren't already italic:

```js
Transforms.setNodes(
  editor,
  { bold: true },
  {
    // This path references the editor, and is expanded to a range that
    // will encompass all the content of the editor.
    at: [],
    // This only matches text nodes that are not already italic.
    match: (node, path) => Text.isText(node) && node.italic !== true,
  }
)
```

When performing transforms, if you're ever looping over nodes and transforming them one at a time, consider seeing if `match` can solve your use case, and offload the complexity of managing loops to Slate instead.
The `match` function can examine the children of a node, in `node.children`, or use `Node.parent` to examine its parent.

## Transforms and Normalization

Sequences of Transforms may need to be wrapped in [`Editor.withoutNormalizing`](../api/nodes/editor.md#editorwithoutnormalizingeditor-editor-fn---void--void) if the node tree should _not_ be normalized between Transforms.
See [Normalization - Implications for Other Code](./11-normalizing.md#implications-for-other-code);
