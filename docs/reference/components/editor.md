
### `<Editor>`

The top-level React component that renders the Slate editor itself.

- [Module](#module)
- [Properties](#properties)
- [Methods](#methods)


### Module

```js
import { Editor } from 'Slate'
```


### Properties

```js
<Editor
  onChange={Function}
  plugins={Array}
  state={State}
/>
```

#### `onChange: Function`

A change handler that will be called with the newly-changed editor `state`. You should usually pass the newly changed `state` back into the editor through its `state` property. This hook allows you to add persistence logic to your editor.

#### `plugins: Array`

An array of [`Plugins`](../plugins) that define the editor's behavior.

#### `state: State`

A [`State`](../models/state) object representing the current state of the editor.

#### `...`

In addition to those two properties, the editor allows passing any of the properties that a [`Plugin`](../plugins) can define: 

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

These properties are actually just a convenience—an implicit plugin defintion. Internally, they are grouped together and turned into a plugin that is given first priority in the plugin stack. 

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


### Methods

#### `getState() => State`

Return the editor's current internal state.

#### `onChange(state: State) => Void`

Effectively the same as `setState`. Invoking this method will update the state of the editor, running it through all of it's plugins, and passing it the parent component, before it cycles back down as the new `state` property of the editor.
