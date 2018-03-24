# Editor

```javascript
import { Editor } from 'slate-react'
```

The top-level React component that renders the Slate editor itself.

## Props

```javascript
<Editor
  autoCorrect={Boolean}
  autoFocus={Boolean}
  className={String}
  onChange={Function}
  placeholder={String || Element}
  plugins={Array}
  readOnly={Boolean}
  role={String}
  spellCheck={Boolean}
  value={Value}
  style={Object}
  tabIndex={Number}
/>
```

### `autoCorrect`

`Boolean`

Whether the editor should attempt to autocorrect spellcheck errors.

### `autoFocus`

`Boolean`

An optional attribute that, when set to true, attempts to give the content editable element focus when it's loaded onto the page.

### `className`

`String`

An optional class name to apply to the content editable element.

### `onChange`

`Function onChange(change: Change)`

A change handler that will be called with the `change` that applied the change. You should usually pass the newly changed `change.value` back into the editor through its `value` property. This hook allows you to add persistence logic to your editor.

### `placeholder`

`String || Element`

A placeholder string \(or React element\) that will be rendered as the default block type's placeholder.

### `plugins`

`Array`

An array of [`Plugins`](plugins.md) that define the editor's behavior.

### `readOnly`

`Boolean`

Whether the editor should be in "read-only" mode, where all of the rendering is the same, but the user is prevented from editing the editor's content.

### `role`

`String`

ARIA property to define the role of the editor, it defaults to `textbox` when editable.

### `spellCheck`

`Boolean`

Whether spellcheck is turned on for the editor.

### `style`

`Object`

An optional dictionary of styles to apply to the content editable element.

### `tabIndex`

`Number`

Indicates if it should participate to [sequential keyboard navigation](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex).

### `value`

`Value`

A [`Value`](../slate-core/value.md) object representing the current value of the editor.

## Plugin-like Props

In addition to its own properties, the editor allows passing any of the properties that a [plugin](plugins.md) defines as well.

These properties are actually just a convenience—an implicit plugin definition. Internally, they are grouped together and turned into a plugin that is given first priority in the plugin stack.

For example, these two snippets of code are equivalent:

```javascript
const plugins = [
  somePlugin
]

<Editor
  onKeyDown={myKeyHandler}
  plugins={plugins}
  value={value}
/>
```

```javascript
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

To see how these properties behave, check out the [Plugins reference](plugins.md).

## Instance Methods

### `blur`

`blur() => Void`

Programmatically blur the editor.

### `change`

`change(fn) => Void`  
`change(fn, ...args) => Void`

Programmatically invoke a change `fn` on the editor. The function will be invokved with a new `change` object representing the editor's current value.

If extra `...args` are passed in, the change `fn` will be invoked with `(change, ...args)`, so you can use this as a shorthand for performing single-function changes.

### `focus`

`focus() => Void`

Programmatically focus the editor.

## Instance Properties

### `schema`

`Schema`

The editor's current schema.

### `stack`

`Stack`

The editor's current stack.

### `value`

`Value`

The editor's current value.

