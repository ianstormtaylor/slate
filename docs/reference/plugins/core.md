
# Core Plugin

Slate's editor is very unopinionated. The only logic it handles by default is logic associated with the `contenteditable` functionality itself—managing text, selections, etc. That logic in contained in a single plugin, called the "core" plugin.

- [Default Behavior](#behavior)
- [Overriding Defaults](#overriding-defaults)


## Default Behavior

The default behavior of the core plugin performs the following logic:

#### `onBeforeInput`

When text is entered, the core plugin inserts the text from `event.data` into the editor.

#### `onKeyDown`

When a key is pressed, the core plugin handles performing some of the "native" behavior that `contenteditable` elements must do. For example it splits blocks on `enter`, removes characters `backspace`, triggers an undo state from the history on `cmd-z`, etc.

#### `onPaste`

When the user pastes content into the editor, the core plugin handles all pastes of type `text` and `html` as plain text, and does nothing for pastes of type `files`. 

#### `renderNode`

The core plugin renders a default block and inline node, wrapping in a `<div>` and `<span>`, respectively. Each of these nodes contains `shouldComponentUpdate` logic prevents unnecessary re-renders.

The default block node also controls its own placeholder logic, which is controlled via the [`<Editor>`](../components/editor.md)'s placeholder options.

#### `renderMark`

The core plugin adds no default styles to marks.


## Overriding Defaults

Any plugin you add to the editor will override the default behavior of the core plugin simply because it is always resolved last.

However, sometimes you might want to disable the logic of the core plugin without actually adding any logic yourself. For example, you might want to prevent the `enter` key from performing any action. In those cases, you'll need to define a "noop" handler. 

A noop `onBeforeInput` handler looks like:

```js
function onBeforeInput(event, state, editor) {
  event.preventDefault()
  return state
}
```

Notice that is calls `event.preventDefault()` to prevent the default browser behavior, and it returns the current `state` to prevent the editor from continuing to resolve its plugins stack.
