import isPlainObject from 'is-plain-object'
import { Node } from '..'

/**
 * The `Fragment` interface describes a tree of nodes that exist independent of
 * a Slate document.
 */

interface Fragment {
  nodes: Node[]
  [key: string]: any
}

namespace Fragment {
  /**
   * Check if a value implements the `Fragment` interface.
   */

  export const isFragment = (value: any): value is Fragment => {
    return isPlainObject(value) && Node.isNodeList(value.nodes)
  }
}

export { Fragment }
