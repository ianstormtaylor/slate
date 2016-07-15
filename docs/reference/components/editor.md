
# `<Editor>`

```js
import { Editor } from 'slate'
```

The top-level React component that renders the Slate editor itself.

- [Properties](#properties)
  - [`className`](#classname)
  - [`onChange`](#onchange)
  - [`plugins`](#plugins)
  - [`state`](#state)
  - [`style`](#style)
- [Placeholder Properties](#placeholder-properties)
  - [`placeholder`](#placeholder)
  - [`placeholderClassName`](#placeholderclassname)
  - [`placeholderStyle`](#placeholderstyle)
- [Plugin-like Properties](#plugin-like-properties)
  - [`onBeforeInput`](#onbeforeinput-function)
  - [`onKeyDown`](#onkeydown-function)
  - [`onPaste`](#onpaste-function)
  - [`renderDecorations`](#renderdecorations-function)
  - [`renderMark`](#rendermark-function)
  - [`renderNode`](#rendernode-function)
- [Methods](#methods)
  - [`getState()`](#getstate-state)
  - [`onChange(state)`](#onchange-state-void)


## Properties

```js
<Editor
  className={string}
  onChange={Function}
  plugins={Array}
  state={State}
  style={Object}
/>
```

### `className` 
`String`

An optional class name to apply to the content editable element.

### `onChange`
`Function`

A change handler that will be called with the newly-changed editor `state`. You should usually pass the newly changed `state` back into the editor through its `state` property. This hook allows you to add persistence logic to your editor.

### `plugins`
`Array`

An array of [`Plugins`](../plugins) that define the editor's behavior.

### `state`
`State`

A [`State`](../models/state) object representing the current state of the editor.

### `style`
`Object`

An optional dictionary of styles to apply to the content editable element.


## Placeholder Properties

```js
<Editor
  placeholder={String || Element}
  placeholderClassName={String}
  placeholderStyle={Object}
/>
```

### `placeholder`
`String || Element`

A placeholder string (or React element) that will be rendered as the default block type's placeholder.

### `placeholderClassName`
`String`

An optional class name to apply to the default block type's placeholder.

### `placeholderStyle`
`Object`

An optional dictionary of styles to apply to the default block type's placeholder. If `placeholder` is a string, and no class name or style dictionary is passed, this property will default to `{ opacity: '0.333' }`.


## Plugin-like Properties

In addition to its own properties, the editor allows passing any of the properties that a [plugin](../plugins/plugins.md) defines as well. 

These properties are actually just a convenience—an implicit plugin definition. Internally, they are grouped together and turned into a plugin that is given first priority in the plugin stack. 

For example, these two snippets of code are equivalent:

```js
const plugins = [
  somePlugin
]

<Editor
  onKeyDown={myKeyHandler}
  plugins={plugins}
  state={state}
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
  state={state}
/>
```

To see how these properties behave, check out the [Plugins reference](../plugins/plugins.md).


## Methods

### `getState` 
`getState() => State`

Return the editor's current internal state.

### `onChange` 
`onChange(state: State) => Void`

Effectively the same as `setState`. Invoking this method will update the state of the editor, running it through all of it's plugins, and passing it the parent component, before it cycles back down as the new `state` property of the editor.
