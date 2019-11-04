import { Node, Path, Range, Value } from 'slate'

import { ReactEditor } from '.'
import {
  IS_FOCUSED,
  IS_READ_ONLY,
  NODE_TO_INDEX,
  NODE_TO_PARENT,
} from '../utils/weak-maps'

export default class ReactEditorQueries {
  /**
   * Find the path of Slate node.
   */

  findPath(this: ReactEditor, node: Node): Path {
    const path: Path = []
    let child = node

    while (true) {
      const parent = NODE_TO_PARENT.get(child)

      if (parent == null) {
        if (Value.isValue(child)) {
          return path
        } else {
          break
        }
      }

      const i = NODE_TO_INDEX.get(child)

      if (i == null) {
        break
      }

      path.unshift(i)
      child = parent
    }

    throw new Error(
      `Unable to find the path for Slate node: ${JSON.stringify(node)}`
    )
  }

  /**
   * Resolve the decorations for a node.
   */

  getDecorations(this: ReactEditor, node: Node): Range[] {
    return []
  }

  /**
   * Check if the editor is focused.
   */

  isFocused(this: ReactEditor): boolean {
    return !!IS_FOCUSED.get(this)
  }

  /**
   * Check if the editor is in read-only mode.
   */

  isReadOnly(this: ReactEditor): boolean {
    return !!IS_READ_ONLY.get(this)
  }
}
