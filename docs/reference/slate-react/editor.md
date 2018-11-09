# `<Editor>`

```js
import { Editor } from 'slate-react'
```

The top-level React component that renders the Slate editor itself.

## Props

```js
<Editor
  id={String}
  autoCorrect={Boolean}
  autoFocus={Boolean}
  className={String}
  commands={Object}
  onChange={Function}
  placeholder={String | Element}
  plugins={Array}
  queries={Object}
  readOnly={Boolean}
  role={String}
  schema={Object}
  spellCheck={Boolean}
  value={Value}
  style={Object}
  tabIndex={Number}
/>
```

### `id`

`String`

Id for the top-level rendered HTML element of the editor.

### `autoCorrect`

`Boolean`

Whether or not the editor should attempt to autocorrect spellcheck errors.

### `autoFocus`

`Boolean`

Whether or not the editor should attempt to give the contenteditable element focus when it's loaded onto the page.

### `className`

`String`

An optional class name to apply to the contenteditable element.

### `onChange`

`Function onChange(change: Change)`

A change handler that will be called with the `change` that applied the change. You should usually pass the newly changed `change.value` back into the editor through its `value` property. This hook allows you to add persistence logic to your editor.

### `placeholder`

`String || Element`

A placeholder string (or React element) that will be rendered if the document only contains a single empty block.

### `plugins`

`Array`

An array of [`Plugins`](./plugins.md) that define the editor's behavior.

### `readOnly`

`Boolean`

Whether the editor should be in "read-only" mode, where all of the rendering is the same, but the user is prevented from editing the editor's content.

### `role`

`String`

ARIA property to define the role of the editor, it defaults to `textbox` when editable.

### `spellCheck`

`Boolean`

Whether or not spellcheck is turned on for the editor.

### `style`

`Object`

An optional dictionary of styles to apply to the contenteditable element.

### `tabIndex`

`Number`

Indicates if it should participate to [sequential keyboard navigation](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex).

### `value`

`Value`

A [`Value`](../slate/value.md) object representing the current value of the editor.

## Plugin-like Props

In addition to its own properties, the editor allows passing any of the properties that a [plugin](./plugins.md) defines as well.

These properties are actually just a convenience—an implicit plugin definition. Internally, they are grouped together and turned into a plugin that is given first priority in the plugin stack.

For example, these two snippets of code are equivalent:

```js
const plugins = [
  somePlugin
]

<Editor
  onKeyDown={myKeyHandler}
  plugins={plugins}
  value={value}
/>
```

```js
const editorPlugin = {
  onKeyDown: myKeyHandler
}

const plugins = [
  editorPlugin,
  somePlugin
]

<Editor
  plugins={plugins}
  value={value}
/>
```

### `onBeforeInput`

### `onBlur`

### `onFocus`

### `onCopy`

### `onCut`

### `onDrop`

### `onKeyDown`

### `onKeyUp`

### `onPaste`

### `onSelect`

### `schema`

To see how these properties behave, check out the [Plugins reference](./plugins.md).
