import ReactDOM from 'react-dom'
import { BaseEditor, Node } from 'slate'
import { withDOM, IS_ANDROID, EDITOR_TO_PENDING_SELECTION } from 'slate-dom'
import { ReactEditor } from './react-editor'
import { REACT_MAJOR_VERSION } from '../utils/environment'
import { getChunkTreeForNode } from '../chunking'

/**
 * `withReact` adds React and DOM specific behaviors to the editor.
 *
 * If you are using TypeScript, you must extend Slate's CustomTypes to use
 * this plugin.
 *
 * See https://docs.slatejs.org/concepts/11-typescript to learn how.
 */
export const withReact = <T extends BaseEditor>(
  editor: T,
  clipboardFormatKey = 'x-slate-fragment'
): T & ReactEditor => {
  let e = editor as T & ReactEditor

  e = withDOM(e, clipboardFormatKey)

  const { onChange, apply, insertText } = e

  e.getChunkSize = () => null

  if (IS_ANDROID) {
    e.insertText = (text, options) => {
      // COMPAT: Android devices, specifically Samsung devices, experience cursor jumping.
      // This issue occurs when the ⁠insertText function is called immediately after typing.
      // The problem arises because typing schedules a selection change.
      // However, this selection change is only executed after the ⁠insertText function.
      // As a result, the already obsolete selection is applied, leading to incorrect
      // final cursor position.
      EDITOR_TO_PENDING_SELECTION.delete(e)

      return insertText(text, options)
    }
  }

  e.onChange = options => {
    // COMPAT: React < 18 doesn't batch `setState` hook calls, which means
    // that the children and selection can get out of sync for one render
    // pass. So we have to use this unstable API to ensure it batches them.
    // (2019/12/03)
    // https://github.com/facebook/react/issues/14259#issuecomment-439702367
    const maybeBatchUpdates =
      REACT_MAJOR_VERSION < 18
        ? ReactDOM.unstable_batchedUpdates
        : (callback: () => void) => callback()

    maybeBatchUpdates(() => {
      onChange(options)
    })
  }

  // On move_node, if the chunking optimization is enabled for the parent of the
  // node being moved, add the moved node to the movedNodeKeys set of the
  // parent's chunk tree.
  e.apply = operation => {
    if (operation.type === 'move_node') {
      const parent = Node.parent(e, operation.path)
      const chunking = !!e.getChunkSize(parent)

      if (chunking) {
        const node = Node.get(e, operation.path)
        const chunkTree = getChunkTreeForNode(e, parent)
        const key = ReactEditor.findKey(e, node)
        chunkTree.movedNodeKeys.add(key)
      }
    }

    apply(operation)
  }

  return e
}
