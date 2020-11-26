# Transforms

Transforms are helper functions operating on the document. They can be used in defining your own commands.

## Node transforms

Transforms that operate on nodes.

###### NodeOptions

All transforms listed below support a parameter `options`. This includes options specific to the transform, and general `NodeOptions` to specify the place in the document that the transform is applied to.

```typescript
interface NodeOptions {
  at?: Location
  match?: (node: Node) => boolean
  mode?: 'highest' | 'lowest'
  voids?: boolean
}
```

###### `Transforms.insertNodes(editor: Editor, nodes: Node | Node[], options?)`

Insert `nodes` at the specified location in the document. If no location is specified, insert at the current selection. If there is no selection, insert at the end of the document.

Options supported: `NodeOptions & {hanging?: boolean, select?: boolean}`.

###### `Transforms.removeNodes(editor: Editor, options?)`

Remove nodes at the specified location in the document. If no location is specified, remove the nodes in the selection.

Options supported: `NodeOptions & {hanging?: boolean}`

###### `Transforms.mergeNodes(editor: Editor, options?)`

Merge a node at the specified location with the previous node at the same depth. If no location is specified, use the selection. Resulting empty container nodes are removed.

Options supported: `NodeOptions & {hanging?: boolean}`

###### `Transforms.splitNodes(editor: Editor, options?)`

Split nodes at the specified location. If no location is specified, split the selection.

Options supported: `NodeOptions & {height?: number, always?: boolean}`

###### `Transforms.wrapNodes(editor: Editor, element: Element, options?)`

Wrap nodes at the specified location in the `element` container. If no location is specified, wrap the selection.

Options supported: `NodeOptions & {split?: boolean}`. For `options.mode`, `'all'` is also supported.

###### `Transforms.unwrapNodes(editor: Editor, options?)`

Unwrap nodes at the specified location. If necessary, the parent node is split. If no location is specified, use the selection.

Options supported: `NodeOptions & {split?: boolean}`. For `options.mode`, `'all'` is also supported.

###### `Transforms.setNodes(editor: Editor, props: Partial<Node>, options?)`

Set properties of nodes at the specified location. If no location is specified, use the selection.

Options supported: `NodeOptions & {hanging?: boolean, split?: boolean}`. For `options.mode`, `'all'` is also supported.

###### `Transforms.unsetNodes(editor: Editor, props: string | string[], options?)`

Unset properties of nodes at the specified location. If no location is specified, use the selection.

Options supported: `NodeOptions & {split?: boolean}`. For `options.mode`, `'all'` is also supported.

###### `Transforms.liftNodes(editor: Editor, options?)`

Lift nodes at the specified location upwards in the document tree. If necessary, the parent node is split. If no location is specified, use the selection.

Options supported: `NodeOptions`. For `options.mode`, `'all'` is also supported.

###### `Transforms.moveNodes(editor: Editor, options)`

Move the nodes from an origin to a destination. A destination must be specified in the `options`. If no origin is specified, move the selection.

Options supported: `NodeOptions & {to: Path}`. For `options.mode`, `'all'` is also supported.

## Selection transforms

Transforms that operate on the document's selection.

###### `Transforms.collapse(editor: Editor, options?)`

Collapse the selection to a single point.

Options: `{edge?: 'anchor' | 'focus' | 'start' | 'end'}`

###### `Transforms.select(editor: Editor, target: Location)`

Set the selection to a new value specified by `target`.

###### `Transforms.deselect(editor: Editor)`

Unset the selection.

###### `Transforms.move(editor: Editor, options?)`

Move the selection's point forward or backward.

Options: `{distance?: number, unit?: 'offset' | 'character' | 'word' | 'line', reverse?: boolean, edge?: 'anchor' | 'focus' | 'start' | 'end'}`

###### `Transforms.setPoint(editor: Editor, props: Partial<Point>, options?)`

Set new properties on one of the selection's points.

Options: `{edge?: 'anchor' | 'focus' | 'start' | 'end'}`

###### `Transforms.setSelection(editor: Editor, props: Partial<Range>)`

Set new properties on the selection.

## Text transforms

Transforms that operate on text.

###### `Transforms.delete(editor: Editor, options?)`

Delete text in the document.

Options: `{at?: Location, distance?: number, unit?: 'character' | 'word' | 'line' | 'block', reverse?: boolean, hanging?: boolean, voids?: boolean}`

###### `Transforms.insertFragment(editor: Editor, fragment: Node[], options?)`

Insert of fragment of nodes at the specified location in the document. If no location is specified, insert at the current selection.

Options: `{at?: Location, hanging?: boolean, voids?: boolean}`

###### `Transforms.insertText(editor: Editor, text: string, options?)`

Insert a string of text at the specified location in the document. If no location is specified, insert at the current selection.

Options: `{at?: Location, voids?: boolean}`

## General transform

###### `Transforms.transform(editor: Editor, transform: Transform)`

Transform the `editor` by an `operation`.
