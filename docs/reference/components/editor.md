
### `<Editor>`

The top-level React component that renders the Slate editor itself.

```js
<Editor
  onChange={Function}
  plugins={Array}
  renderDecorations={Function}
  renderMark={Function}
  renderNode={Function}
  state={State}
/>
```

The editor takes a `State` instance that contains it's content and selection.

Most of the editor's other properties are actually an implicit plugin defintion. Internally they are grouped together and turned into a plugin that is given first priority in the plugin stack. 

#### Properties

#### `onChange(state, editor)`

A handler that's called every time the editor's state changes. It is called with the newly changed `state` and the `editor` instance itself.


#### Methods

#### `getState()`

Return the editor's current internal state.
