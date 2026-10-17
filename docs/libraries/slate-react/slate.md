# Slate Component

## `Slate(props: SlateProps): React.JSX.Element`

The `Slate` component must include somewhere in its `children` the `Editable` component.

### Props

```typescript
type SlateProps = {
  editor: ReactEditor
  initialValue?: Descendant[]
  value?: Descendant[]
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

Changing `initialValue` afterwards has no effect. Use `value` for controlled content, apply transforms, or remount `Slate` with a new `key`.

Each editor must have its own node objects. To render several editors from the same value, give each one a deep copy, for example with `structuredClone(value)`. Sharing the same objects between editors breaks the lookups Slate uses to map nodes to the DOM.

#### `props.value?: Descendant[]`

Control the document with a value from your app, and store the user's edits with `onValueChange`. Passing both `value` and `initialValue` throws. The first value loads the editor as `initialValue` does. Later values are applied in a layout effect through `editor.setChildren` (`Transforms.setChildren`), so the selection and history stay valid.

It follows the contract of a React controlled input:

- Pass back the value from `onValueChange`. That exact object is recognized and not applied again.
- Any other value is treated as a change from outside the editor and applied, including an older value the editor emitted earlier, so an app can restore a previous version.
- Values you pass in, and their normalization, are not reported through `onValueChange`. `onChange` still fires.

Don't feed responses from a server into `value` while the user can still type. A response to an earlier save describes an older document, and applying it reverts the typing made since. Apply outside changes with `Transforms.setChildren` at the point your app decides they are new content.

Keep unchanged node objects when building a new value. Identity makes unchanged subtrees cheap to recognize and lets moved nodes keep the selection inside them. Deep-equal copies produce no operations but need a content comparison.

To change how values are applied, override `editor.setChildren`. For example, to keep a stream out of undo:

```typescript
const { setChildren } = editor
editor.setChildren = children =>
  HistoryEditor.withoutSaving(editor, () => setChildren(children))
```

Updates wait while the editor is composing or Android has pending input, and only the latest pending value is applied afterwards. Pending updates are dropped when `Slate` unmounts or its editor changes.

To switch to a different document, remount `Slate` with a new `key` instead of passing the new document as `value`. Applying a whole new document records it as an undo step and diffs it against the old one.

#### `props.children: React.ReactNode`

The `children` which must contain an `Editable` component.

#### `props.onChange: (value: Descendant[]) => void`

An optional callback function which you can use to be notified of changes in the editor's value.

#### `props.onValueChange?: (value: Descendant[]) => void`

Like `props.onChange`, but only called when the editor's value changes, not for selection-only changes.

#### `props.onSelectionChange?: (selection: Selection) => void`

An optional callback function which you can use to be notified of changes of the editor's selection.
