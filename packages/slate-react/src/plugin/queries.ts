import { Node, Path, Range, Value, Fragment } from 'slate'

import { ReactEditor } from '.'
import {
  IS_FOCUSED,
  IS_READ_ONLY,
  NODE_TO_INDEX,
  NODE_TO_PARENT,
} from '../utils/weak-maps'
import { decode } from '../utils/base-64'

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
   * Get a Slate fragment from a `DataTransfer` object.
   */

  getDataTransferFragment(
    this: ReactEditor,
    dataTransfer: DataTransfer
  ): Fragment | undefined {
    const base64 = dataTransfer.getData('application/x-slate-fragment')

    if (base64) {
      const fragment = decode(base64)
      return fragment
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
