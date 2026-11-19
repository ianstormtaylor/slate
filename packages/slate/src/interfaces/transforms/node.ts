import { Descendant, Editor, Element, Location, Node, Path } from '../../index'
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
   * {@inheritDoc BaseEditor#setChildren}
   */
  setChildren(editor: Editor, children: Descendant[]): void

  /**
   * {@inheritDoc BaseEditor#insertNodes}
   */
  insertNodes<T extends Node>(
    editor: Editor,
    nodes: Node | Node[],
    options?: NodeInsertNodesOptions<T>
  ): void

  /**
   * {@inheritDoc BaseEditor#liftNodes}
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
   * {@inheritDoc BaseEditor#mergeNodes}
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
   * {@inheritDoc BaseEditor#moveNodes}
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
   * {@inheritDoc BaseEditor#removeNodes}
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
   * {@inheritDoc BaseEditor#setNodes}
   */
  setNodes<T extends Node>(
    editor: Editor,
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
      replace?: boolean
    }
  ): void

  /**
   * {@inheritDoc BaseEditor#splitNodes}
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
   * {@inheritDoc BaseEditor#unsetNodes}
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
   * {@inheritDoc BaseEditor#unwrapNodes}
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
   * {@inheritDoc BaseEditor#wrapNodes}
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
  setChildren(editor, children) {
    editor.setChildren(children)
  },
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
