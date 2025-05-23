import { Editor, Descendant } from 'slate'
import { ChunkTree, ChunkLeaf } from './types'
import { ChunkTreeHelper, ChunkTreeHelperOptions } from './chunk-tree-helper'
import { ChildrenHelper } from './children-helper'

export interface ReconcileOptions extends ChunkTreeHelperOptions {
  chunkTree: ChunkTree
  children: Descendant[]
  chunkSize: number
  rerenderChildren?: number[]
  onInsert?: (node: Descendant, index: number) => void
  onUpdate?: (node: Descendant, index: number) => void
  onIndexChange?: (node: Descendant, index: number) => void
  debug?: boolean
}

/**
 * Update the chunk tree to match the children array, inserting, removing and
 * updating differing nodes
 */
export const reconcileChildren = (
  editor: Editor,
  {
    chunkTree,
    children,
    chunkSize,
    rerenderChildren = [],
    onInsert,
    onUpdate,
    onIndexChange,
    debug,
  }: ReconcileOptions
) => {
  chunkTree.modifiedChunks.clear()

  const chunkTreeHelper = new ChunkTreeHelper(chunkTree, { chunkSize, debug })
  const childrenHelper = new ChildrenHelper(editor, children)

  let treeLeaf: ChunkLeaf | null

  // Read leaves from the tree one by one, each one representing a single Slate
  // node. Each leaf from the tree is compared to the current node in the
  // children array to determine whether nodes have been inserted, removed or
  // updated.
  while ((treeLeaf = chunkTreeHelper.readLeaf())) {
    // Check where the tree node appears in the children array. In the most
    // common case (where no insertions or removals have occurred), this will be
    // 0. If the node has been removed, this will be -1. If new nodes have been
    // inserted before the node, or if the node has been moved to a later
    // position in the same children array, this will be a positive number.
    const lookAhead = childrenHelper.lookAhead(treeLeaf.node, treeLeaf.key)

    // If the node was moved, we want to remove it and insert it later, rather
    // then re-inserting all intermediate nodes before it.
    const wasMoved = lookAhead > 0 && chunkTree.movedNodeKeys.has(treeLeaf.key)

    // If the tree leaf was moved or removed, remove it
    if (lookAhead === -1 || wasMoved) {
      chunkTreeHelper.remove()
      continue
    }

    // Get the matching Slate node and any nodes that may have been inserted
    // prior to it. Insert these into the chunk tree.
    const insertedChildrenStartIndex = childrenHelper.pointerIndex
    const insertedChildren = childrenHelper.read(lookAhead + 1)
    const matchingChild = insertedChildren.pop()!

    if (insertedChildren.length) {
      const leavesToInsert = childrenHelper.toChunkLeaves(
        insertedChildren,
        insertedChildrenStartIndex
      )

      chunkTreeHelper.insertBefore(leavesToInsert)

      insertedChildren.forEach((node, relativeIndex) => {
        onInsert?.(node, insertedChildrenStartIndex + relativeIndex)
      })
    }

    const matchingChildIndex = childrenHelper.pointerIndex - 1

    // Make sure the chunk tree contains the most recent version of the Slate
    // node
    if (treeLeaf.node !== matchingChild) {
      treeLeaf.node = matchingChild
      chunkTreeHelper.invalidateChunk()
      onUpdate?.(matchingChild, matchingChildIndex)
    }

    // Update the index if it has changed
    if (treeLeaf.index !== matchingChildIndex) {
      treeLeaf.index = matchingChildIndex
      onIndexChange?.(matchingChild, matchingChildIndex)
    }

    // Manually invalidate chunks containing specific children that we want to
    // re-render
    if (rerenderChildren.includes(matchingChildIndex)) {
      chunkTreeHelper.invalidateChunk()
    }
  }

  // If there are still Slate nodes remaining from the children array that were
  // not matched to nodes in the tree, insert them at the end of the tree
  if (!childrenHelper.reachedEnd) {
    const remainingChildren = childrenHelper.remaining()

    const leavesToInsert = childrenHelper.toChunkLeaves(
      remainingChildren,
      childrenHelper.pointerIndex
    )

    // Move the pointer back to the final leaf in the tree, or the start of the
    // tree if the tree is currently empty
    chunkTreeHelper.returnToPreviousLeaf()

    chunkTreeHelper.insertAfter(leavesToInsert)

    remainingChildren.forEach((node, relativeIndex) => {
      onInsert?.(node, childrenHelper.pointerIndex + relativeIndex)
    })
  }

  chunkTree.movedNodeKeys.clear()
}
