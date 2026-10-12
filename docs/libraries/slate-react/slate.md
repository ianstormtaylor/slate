# Slate Component

## `Slate(props: SlateProps): React.JSX.Element`

The `Slate` component must include somewhere in its `children` the `Editable` component.

### Props

```typescript
type SlateProps = {
  editor: ReactEditor
  initialValue: Descendant[]
  children: React.ReactNode
  onChange?: (value: Descendant[]) => void
  onSelectionChange?: (selection: Selection) => void
  onValueChange?: (value: Descendant[]) => void
}
```

#### `props.editor: ReactEditor`

An instance of `ReactEditor`

#### `props.initialValue?: Descendant[]`

The initial value of the editor. It is loaded into the editor when `Slate` mounts, and again if a different `editor` is passed.

If you leave it out, the editor's existing `editor.children` are used, which suits editors you create and fill ahead of rendering. Leaving it out when `editor.children` is empty throws, since that is usually a forgotten setup step; pass `initialValue={[]}` if an empty editor is intended.

An editor needs at least one block to hold the cursor, so an empty array is loaded as one empty block, `{ children: [{ text: '' }] }`. The block has no `type`, so if your schema requires one, pass your own empty block instead, for example `[{ type: 'paragraph', children: [{ text: '' }] }]`.

Slate is not a controlled component: changing `initialValue` afterwards has no effect, because directly replacing the value would corrupt state such as the edit history. To change the content, apply transforms to the editor, or remount `Slate` with a new `key`.

Each editor must have its own node objects. To render several editors from the same value, give each one a deep copy, for example with `structuredClone(value)`. Sharing the same objects between editors breaks the lookups Slate uses to map nodes to the DOM.

#### `props.children: React.ReactNode`

The `children` which must contain an `Editable` component.

#### `props.onChange: (value: Descendant[]) => void`

An optional callback function which you can use to be notified of changes in the editor's value.

#### `props.onValueChange?: (value: Descendant[]) => void`

Like `props.onChange`, but only called when the editor's value changes, not for selection-only changes.

#### `props.onSelectionChange?: (selection: Selection) => void`

An optional callback function which you can use to be notified of changes of the editor's selection.
