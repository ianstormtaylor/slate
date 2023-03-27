import { Editor, Element, Location, Node, Path } from '../../index'
import { NodeMatch, PropsCompare, PropsMerge } from '../editor'
import { MaximizeMode, RangeMode } from '../../types/types'

export interface NodeTransforms {
  insertNodes: <T extends Node>(
    editor: Editor,
    nodes: Node | Node[],
    options?: {
      at?: Location
      match?: NodeMatch<T>
      mode?: RangeMode
      hanging?: boolean
      select?: boolean
      voids?: boolean
    }
  ) => void
  liftNodes: <T extends Node>(
    editor: Editor,
    options?: {
      at?: Location
      match?: NodeMatch<T>
      mode?: MaximizeMode
      voids?: boolean
    }
  ) => void
  mergeNodes: <T extends Node>(
    editor: Editor,
    options?: {
      at?: Location
      match?: NodeMatch<T>
      mode?: RangeMode
      hanging?: boolean
      voids?: boolean
    }
  ) => void
  moveNodes: <T extends Node>(
    editor: Editor,
    options: {
      at?: Location
      match?: NodeMatch<T>
      mode?: MaximizeMode
      to: Path
      voids?: boolean
    }
  ) => void
  removeNodes: <T extends Node>(
    editor: Editor,
    options?: {
      at?: Location
      match?: NodeMatch<T>
      mode?: RangeMode
      hanging?: boolean
      voids?: boolean
    }
  ) => void
  setNodes: <T extends Node>(
    editor: Editor,
    props: Partial<T>,
    options?: {
      at?: Location
      match?: NodeMatch<T>
      mode?: MaximizeMode
      hanging?: boolean
      split?: boolean
      voids?: boolean
      compare?: PropsCompare
      merge?: PropsMerge
    }
  ) => void
  splitNodes: <T extends Node>(
    editor: Editor,
    options?: {
      at?: Location
      match?: NodeMatch<T>
      mode?: RangeMode
      always?: boolean
      height?: number
      voids?: boolean
    }
  ) => void
  unsetNodes: <T extends Node>(
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
  ) => void
  unwrapNodes: <T extends Node>(
    editor: Editor,
    options?: {
      at?: Location
      match?: NodeMatch<T>
      mode?: MaximizeMode
      split?: boolean
      voids?: boolean
    }
  ) => void
  wrapNodes: <T extends Node>(
    editor: Editor,
    element: Element,
    options?: {
      at?: Location
      match?: NodeMatch<T>
      mode?: MaximizeMode
      split?: boolean
      voids?: boolean
    }
  ) => void
}

// eslint-disable-next-line no-redeclare
export const NodeTransforms: NodeTransforms = {
  /**
   * Insert nodes at a specific location in the Editor.
   */
  insertNodes(editor, nodes, options) {
    editor.insertNodes(nodes, options)
  },

  /**
   * Lift nodes at a specific location upwards in the document tree, splitting
   * their parent in two if necessary.
   */
  liftNodes(editor, options) {
    editor.liftNodes(options)
  },

  /**
   * Merge a node at a location with the previous node of the same depth,
   * removing any empty containing nodes after the merge if necessary.
   */
  mergeNodes(editor, options) {
    editor.mergeNodes(options)
  },

  /**
   * Move the nodes at a location to a new location.
   */
  moveNodes(editor, options) {
    editor.moveNodes(options)
  },

  /**
   * Remove the nodes at a specific location in the document.
   */
  removeNodes(editor, options) {
    editor.removeNodes(options)
  },

  /**
   * Set new properties on the nodes at a location.
   */
  setNodes(editor, props, options) {
    editor.setNodes(props, options)
  },

  /**
   * Split the nodes at a specific location.
   */
  splitNodes(editor, options) {
    editor.splitNodes(options)
  },

  /**
   * Unset properties on the nodes at a location.
   */
  unsetNodes(editor, props, options) {
    editor.unsetNodes(props, options)
  },

  /**
   * Unwrap the nodes at a location from a parent node, splitting the parent if
   * necessary to ensure that only the content in the range is unwrapped.
   */
  unwrapNodes(editor, options) {
    editor.unwrapNodes(options)
  },

  /**
   * Wrap the nodes at a location in a new container node, splitting the edges
   * of the range first to ensure that only the content in the range is wrapped.
   */
  wrapNodes(editor, element, options) {
    editor.wrapNodes(element, options)
  },
}
