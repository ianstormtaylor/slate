
# Core Plugin

Slate's editor is very unopinionated. The only logic it handles by default is logic associated with the `contenteditable` functionality itself—managing text, selections, etc. That logic in contained in a single plugin, called the "core" plugin.

- [Default Behavior](#behavior)
- [Overriding Defaults](#overriding-defaults)


## Default Behavior

The default behavior of the core plugin performs the following logic:

### `onBeforeInput`

When text is entered, the core plugin inserts the text from `event.data` into the editor.

### `onBlur`

When the editor is blurred, the core plugin updates the selection in Slate's internal data model without re-rendering.

### `onFocus`

When the editor is focused, the core plugin updates the selection in Slate's internal data model without re-rendering.

### `onCopy`

When the user copies part of the document, the core plugin adds the copied text to the clipboard with a serialized version of the document intact, so that it can be deserialized and inserted on paste, preserving formatting.

### `onCut`

When the user cuts part of the document, the core plugin runs the same logic it runs for `onCopy`, but it also delete's the content in the current selection.

### `onDrop`

When the user drops content into the editor, the core plugin handles drops of type `text` and `html` as plain text, and does nothing for drops of type `files`.

### `onKeyDown`

When a key is pressed, the core plugin handles performing some of the "native" behavior that `contenteditable` elements must do. For example it splits blocks on `enter`, removes characters `backspace`, triggers an undo state from the history on `cmd-z`, etc.

### `onPaste`

When the user pastes content into the editor, the core plugin handles all pastes of type `text` and `html` as plain text, and does nothing for pastes of type `files`.

### `onSelect`

When the user makes a new selection in the DOM, the core plugin updates that selection in Slate's internal data model, re-rendering if it needs to. 

### `render`

Renders all of the default contents of the editor!

### `schema`

The core plugin defines a schema that enforces a few constraints on the content and defines default block and inline node renderer components—wrapping in a `<div>` and `<span>`, respectively. Each of these components contains `shouldComponentUpdate` logic that prevents unnecessary re-renders.

The default block component also controls its own placeholder logic, which is controlled via the [`<Editor>`](../components/editor.md)'s placeholder options.


## Overriding Defaults

Any plugin you add to the editor will override the default behavior of the core plugin, because it is always resolved last.

However, sometimes you might want to disable the logic of the core plugin without actually adding any logic yourself. For example, you might want to prevent the `enter` key from performing any action. In those cases, you'll need to define a "noop" handler. 

A noop `onBeforeInput` handler looks like:

```js
function onBeforeInput(event, data, state) {
  event.preventDefault()
  return state
}
```

Notice that is calls `event.preventDefault()` to prevent the default browser behavior, and it returns the current `state` to prevent the editor from continuing to resolve its plugins stack.
