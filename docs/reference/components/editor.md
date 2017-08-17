
# `<Editor>`

```js
import { Editor } from 'slate'
```

The top-level React component that renders the Slate editor itself.

- [Properties](#properties)
  - [`autoCorrect`](#autocorrect)
  - [`autoFocus`](#autofocus)
  - [`className`](#classname)
  - [`onChange`](#onchange)
  - [`onDocumentChange`](#ondocumentchange)
  - [`onSelectionChange`](#onselectionchange)
  - [`plugins`](#plugins)
  - [`readOnly`](#readonly)
  - [`role`](#role)
  - [`spellCheck`](#spellcheck)
  - [`state`](#state)
  - [`style`](#style)
  - [`tabIndex`](#tabindex)
- [Placeholder Properties](#placeholder-properties)
  - [`placeholder`](#placeholder)
  - [`placeholderClassName`](#placeholderclassname)
  - [`placeholderStyle`](#placeholderstyle)
- [Plugin-like Properties](#plugin-like-properties)
  - [`onBeforeInput`](#onbeforeinput)
  - [`onBlur`](#onblur)
  - [`onFocus`](#onfocus)
  - [`onCopy`](#oncopy)
  - [`onCut`](#oncut)
  - [`onDrop`](#ondrop)
  - [`onKeyDown`](#onkeydown)
  - [`onPaste`](#onpaste)
  - [`onSelect`](#onselect)
  - [`schema`](#schema)
- [Methods](#methods)
  - [`blur`](#blur)
  - [`focus`](#focus)
  - [`getSchema()`](#getschema)
  - [`getState()`](#getstate)
  - [`onChange(state)`](#onchange)

## Properties

```js
<Editor
  autoCorrect={Boolean}
  autoFocus={Boolean}
  className={String}
  onChange={Function}
  onDocumentChange={Function}
  onSelectionChange={Function}
  plugins={Array}
  readOnly={Boolean}
  role={String}
  spellCheck={Boolean}
  state={State}
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
`Function onChange(state: State)`

A change handler that will be called with the newly-changed editor `state`. You should usually pass the newly changed `state` back into the editor through its `state` property. This hook allows you to add persistence logic to your editor.

### `onDocumentChange`
`Function onDocumentChange(document: Document, state: State)`

A convenience handler property that will only be called for changes in state where the document has changed. It is called with the changed `document` and `state`.

### `onSelectionChange`
`Function onSelectionChange(selection: Selection, state: State)`

A convenience handler property that will only be called for changes in state where the selection has changed. It is called with the changed `selection` and `state`.

### `plugins`
`Array`

An array of [`Plugins`](../plugins/plugin.md) that define the editor's behavior.

### `readOnly`
`Boolean`

Whether the editor should be in "read-only" mode, where all of the rendering is the same, but the user is prevented from editing the editor's content.

### `spellCheck`
`Boolean`

Whether spellcheck is turned on for the editor.

### `role`
`String`

ARIA property to define the role of the editor, it defaults to `textbox` when editable.

### `state`
`State`

A [`State`](../models/state.md) object representing the current state of the editor.

### `style`
`Object`

An optional dictionary of styles to apply to the content editable element.

### `tabIndex`
`Number`

Indicates if it should participate to [sequential keyboard navigation](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex).

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

In addition to its own properties, the editor allows passing any of the properties that a [plugin](../plugins/plugin.md) defines as well.

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

### `onBeforeInput`
### `onBlur`
### `onFocus`
### `onCopy`
### `onCut`
### `onDrop`
### `onKeyDown`
### `onPaste`
### `onSelect`
### `schema`

To see how these properties behave, check out the [Plugins reference](../plugins/plugin.md).


## Methods

### `blur`
`blur() => Void`

Programmatically blur the editor.

### `focus`
`focus() => Void`

Programmatically focus the editor.

### `getSchema`
`getSchema() => Schema`

Return the editor's current schema.

### `getState`
`getState() => State`

Return the editor's current state.

### `onChange`
`onChange(state: State) => Void`

Effectively the same as `setState`. Invoking this method will update the state of the editor, running it through all of it's plugins, and passing it the parent component, before it cycles back down as the new `state` property of the editor.
