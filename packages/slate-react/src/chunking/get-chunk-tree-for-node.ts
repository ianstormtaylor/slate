import type { Ancestor, Editor } from 'slate'
import type { Key } from 'slate-dom'
import { ReactEditor } from '../plugin/react-editor'
import { type ReconcileOptions, reconcileChildren } from './reconcile-children'
import type { ChunkTree } from './types'

export const KEY_TO_CHUNK_TREE = new WeakMap<Key, ChunkTree>()

/**
 * Get or create the chunk tree for a Slate node
 *
 * If the reconcile option is provided, the chunk tree will be updated to
 * match the current children of the node. The children are chunked
 * automatically using the given chunk size.
 */
export const getChunkTreeForNode = (
  editor: Editor,
  node: Ancestor,
  // istanbul ignore next
  options: {
    reconcile?: Omit<ReconcileOptions, 'chunkTree' | 'children'> | false
  } = {}
) => {
  const key = ReactEditor.findKey(editor, node)
  let chunkTree = KEY_TO_CHUNK_TREE.get(key)

  if (!chunkTree) {
    chunkTree = {
      type: 'root',
      movedNodeKeys: new Set(),
      modifiedChunks: new Set(),
      children: [],
    }

    KEY_TO_CHUNK_TREE.set(key, chunkTree)
  }

  if (options.reconcile) {
    reconcileChildren(editor, {
      chunkTree,
      children: node.children,
      ...options.reconcile,
    })
  }

  return chunkTree
}
