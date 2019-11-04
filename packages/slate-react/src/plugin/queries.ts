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

  findPath(this: ReactEditor, node: Node): Path | undefined {
    const path = []
    let parent = node

    while (true) {
      const p = NODE_TO_PARENT.get(parent)

      if (p == null) {
        if (Value.isValue(p)) {
          return path
        } else {
          break
        }
      }

      const i = NODE_TO_INDEX.get(parent)

      if (i == null) {
        break
      }

      path.push(i)
      parent = p
    }
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
