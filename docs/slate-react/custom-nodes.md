# Custom Nodes

Slate will render custom nodes for [`Block`](../slate-core/block.md) and [`Inline`](../slate-core/inline.md) models, based on what you pass in as your schema. This allows you to completely customize the rendering behavior of your Slate editor.

## Props

```javascript
<{Custom}
  attributes={Object}
  children={Object}
  editor={Editor}
  isSelected={Boolean}
  node={Node}
  parent={Node}
  readOnly={Boolean}
/>
```

### `attributes`

`Object`

A dictionary of DOM attributes that you must attach to the main DOM element of the node you render. For example:

```javascript
return <p {...props.attributes}>{props.children}</p>
```

```javascript
return (
  <figure {...props.attributes}>
    <img src={...} />
  </figure>
)
```

### `children`

`Object`

A set of React children elements that are composed of internal Slate components that handle all of the editing logic of the editor for you. You must render these as the children of your non-void nodes. For example:

```javascript
return <p {...props.attributes}>{props.children}</p>
```

### `editor`

`Editor`

A reference to the Slate [`<Editor>`](editor.md) instance. This allows you to retrieve the current `value` of the editor, or perform a `change` on the value. For example:

```javascript
const value = editor.value
```

```javascript
editor.change(change => {
  change.selectAll().delete()
})
```

### `isSelected`

`Boolean`

A boolean representing whether the node you are rendering is currently selected. You can use this to render a visual representation of the selection.

### `node`

`Node`

A reference to the [`Node`](../slate-core/node.md) being rendered.

### `parent`

`Node`

A reference to the parent of the current [`Node`](../slate-core/node.md) being rendered.

### `readOnly`

`Boolean`

Whether the editor is in "read-only" mode, where all of the rendering is the same, but the user is prevented from editing the editor's content.

## `shouldNodeComponentUpdate`

By default, Slate implements a `shouldComponentUpdate` preventing useless re-renders for node components. While the default implementation covers most use cases, you can customize the logic to fit your needs. For example:

```javascript
class CustomNode extends React.Component {
  static shouldNodeComponentUpdate(previousProps, nextProps) {
    // return true here to trigger a re-render
  }
}
```

If `shouldNodeComponentUpdate` returns false, Slate will still figure out whether a re-render is needed or not.

