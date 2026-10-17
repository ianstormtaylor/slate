import { Editor, Element, Location, Node, Path } from '../../index'
import { NodeMatch, NullableProps, PropsCompare, PropsMerge } from '../editor'
import { MaximizeMode, RangeMode } from '../../types/types'

/** @hidden @inline */
export interface NodeInsertNodesOptions<T extends Node> {
  at?: Location
  match?: NodeMatch<T>
  mode?: RangeMode
  hanging?: boolean
  select?: boolean
  voids?: boolean
  batchDirty?: boolean
}

export interface NodeTransforms {
  /**
   * Insert nodes in the editor at the specified location or (if not defined) the current selection or (if not defined) the end of the document.
   *
   * @example
   * For example, to insert at the very end, without replacing the current selection and regardless of block nesting, use
   * ```javascript
   * Transforms.insertNodes(
   *   editor,
   *   { type: targetType, children: [{ text: '' }] },
   *   { at: [editor.children.length] }
   * )
   * ```
   */
  insertNodes<T extends Node>(
    editor: Editor,
    nodes: Node | Node[],
    options?: NodeInsertNodesOptions<T>
  ): void

  /**
   * Lift nodes at a specific location upwards in the document tree, splitting
   * their parent in two if necessary.
   */
  liftNodes<T extends Node>(
    editor: Editor,
    options?: {
      at?: Location
      select?: boolean
      /**
       * Defaults to `1` and must be a non-negative integer. A height of `0` does nothing; larger heights lift each matched node through that many ancestors, stopping at the top level. A node that is already at the top level cannot be lifted. For `options.mode`, `'all'` is also supported.
       */
      height?: number
      match?: NodeMatch<T>
      mode?: MaximizeMode
      voids?: boolean
    }
  ): void

  /**
   * Merge a node at a location with the previous node of the same depth,
   * removing any empty containing nodes after the merge if necessary.
   *
   * Merging elements throws if both have children and one contains blocks while the other contains text or inline nodes, unless `shouldMergeNodesRemovePrevNode` removes the previous node instead. The error names both paths and is raised before moving or removing the merge targets. An expanded `at` range can be deleted before this check.
   */
  mergeNodes<T extends Node>(
    editor: Editor,
    options?: {
      at?: Location
      match?: NodeMatch<T>
      mode?: RangeMode
      hanging?: boolean
      voids?: boolean
    }
  ): void

  /**
   * Move the nodes from an origin to a destination. A destination must be specified in the `options`. If no origin is specified, move the selection.
   *
   * `to` is the path the node ends up at once the move is done, not the path it is inserted before. For example, with four blocks `1 2 3 4`, moving `[0]` to `[2]` gives `2 3 1 4`. When `match` selects several nodes, they are moved one at a time, each to `to`.
   */
  moveNodes<T extends Node>(
    editor: Editor,
    options: {
      at?: Location
      select?: boolean
      match?: NodeMatch<T>
      mode?: MaximizeMode
      to: Path
      voids?: boolean
    }
  ): void

  /**
   * Remove the nodes at a specific location in the document.
   */
  removeNodes<T extends Node>(
    editor: Editor,
    options?: {
      at?: Location
      match?: NodeMatch<T>
      mode?: RangeMode
      hanging?: boolean
      voids?: boolean
    }
  ): void

  /**
   * Set properties of nodes at the specified location. If no location is specified, use the selection. Optional node properties can be set to `null` to unset them.
   *
   * If `props` contains `undefined` values, the node's corresponding property will also be set to `undefined` as opposed to ignored.
   *
   * `children` and `text` in `props` are ignored, since they hold a node's content rather than its properties. To change content, use `insertNodes`, `removeNodes` or the text transforms.
   */
  setNodes<T extends Node>(
    editor: Editor,
    /**
     * `props` can also be a function that receives each matched node and its path and returns the properties for that node, so new values can depend on old ones. Each node still gets one `set_node` operation, so undo works per node:
     *
     * @example
     * ```javascript
     * Transforms.setNodes(editor, node => ({ indent: (node.indent ?? 0) + 1 }), {
     *   match: n => Element.isElement(n) && n.type === 'paragraph',
     * })
     * ```
     */
    props:
      | Partial<NullableProps<T>>
      | ((node: T, path: Path) => Partial<NullableProps<T>>),
    options?: {
      at?: Location
      match?: NodeMatch<T>
      mode?: MaximizeMode
      hanging?: boolean
      split?: boolean
      voids?: boolean
      compare?: PropsCompare
      merge?: PropsMerge

      /**
       * With `replace: true`, every other property of each matched node is removed in the same operation, so the node ends up with exactly `props` (plus its `children` or `text`). Use it to change a node into a different type without carrying over properties that only made sense for the old type, such as turning `{ type: 'callout', color: 'blue' }` into `{ type: 'paragraph' }`. Undo restores the removed properties.
       */
      replace?: boolean
    }
  ): void

  /**
   * Split the nodes at a specific location.
   */
  splitNodes<T extends Node>(
    editor: Editor,
    options?: {
      at?: Location
      select?: boolean
      match?: NodeMatch<T>
      mode?: RangeMode
      always?: boolean
      height?: number
      voids?: boolean
    }
  ): void

  /**
   * Unset properties on the nodes at a location.
   */
  unsetNodes<T extends Node>(
    editor: Editor,
    props: string | string[],
    options?: {
      at?: Location
      match?: NodeMatch<T>
      mode?: MaximizeMode
      hanging?: boolean
      split?: boolean
      voids?: boolean
    }
  ): void

  /**
   * Unwrap the nodes at a location from a parent node, splitting the parent if
   * necessary to ensure that only the content in the range is unwrapped.
   */
  unwrapNodes<T extends Node>(
    editor: Editor,
    options?: {
      at?: Location
      match?: NodeMatch<T>
      mode?: MaximizeMode
      hanging?: boolean
      split?: boolean
      voids?: boolean
    }
  ): void

  /**
   * Wrap the nodes at a location in a new container node, splitting the edges
   * of the range first to ensure that only the content in the range is wrapped.
   */
  wrapNodes<T extends Node>(
    editor: Editor,
    element: Element,
    options?: {
      at?: Location
      match?: NodeMatch<T>
      mode?: MaximizeMode
      hanging?: boolean
      split?: boolean
      voids?: boolean
    }
  ): void
}

// eslint-disable-next-line no-redeclare
export const NodeTransforms: NodeTransforms = {
  insertNodes(editor, nodes, options) {
    editor.insertNodes(nodes, options)
  },
  liftNodes(editor, options) {
    editor.liftNodes(options)
  },
  mergeNodes(editor, options) {
    editor.mergeNodes(options)
  },
  moveNodes(editor, options) {
    editor.moveNodes(options)
  },
  removeNodes(editor, options) {
    editor.removeNodes(options)
  },
  setNodes(editor, props, options) {
    editor.setNodes(props, options)
  },
  splitNodes(editor, options) {
    editor.splitNodes(options)
  },
  unsetNodes(editor, props, options) {
    editor.unsetNodes(props, options)
  },
  unwrapNodes(editor, options) {
    editor.unwrapNodes(options)
  },
  wrapNodes(editor, element, options) {
    editor.wrapNodes(element, options)
  },
}
