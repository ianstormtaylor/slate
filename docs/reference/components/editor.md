
### `<Editor>`

The top-level React component that renders the Slate editor itself.

```js
<Editor
  plugins={Array}
  state={State}
/>
```

The editor takes a `State` instance that contains it's content and selection, and an array of `plugins` that define its behavior. In addition to those two properties, the editor allows passing any of the properties that a plugin can define: 

```js
<Editor
  onBeforeInput={Function}
  onChange={Function}
  onKeyDown={Function}
  onPaste={Function}
  plugins={Array}
  renderDecorations={Function}
  renderMark={Function}
  renderNode={Function}
  state={State}
/>
```

These properties are actually an implicit plugin defintion. Internally, they are grouped together and turned into a plugin that is given first priority in the plugin stack. 


#### Properties

#### `plugins`

An array of [`Plugins`](../plugins) that define the editor's behavior.

#### `state`

A [`State`](../models/state) object representing the current state of the editor.

#### Plugin-like properties...

All other properties of the editor are equivalent to the properties of a [`Plugin`](../plugins)


#### Methods

#### `getState()`

Return the editor's current internal state.

#### `onChange(state)`

Effectively the same as `setState`, invoking this method will update the state of the editor, running it through all of it's plugins, and passing it the parent component, before it cycles back down as the new `state` property of the editor.
