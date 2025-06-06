import { Path } from 'slate'
import { Key } from 'slate-dom'
import {
  Chunk,
  ChunkTree,
  ChunkLeaf,
  ChunkDescendant,
  ChunkAncestor,
} from './types'

type SavedPointer =
  | 'start'
  | {
      chunk: ChunkAncestor
      node: ChunkDescendant
    }

export interface ChunkTreeHelperOptions {
  chunkSize: number
  debug?: boolean
}

/**
 * Traverse and modify a chunk tree
 */
export class ChunkTreeHelper {
  /**
   * The root of the chunk tree
   */
  private root: ChunkTree

  /**
   * The ideal size of a chunk
   */
  private chunkSize: number

  /**
   * Whether debug mode is enabled
   *
   * If enabled, the pointer state will be checked for internal consistency
   * after each mutating operation.
   */
  private debug: boolean

  /**
   * Whether the traversal has reached the end of the chunk tree
   *
   * When this is true, the pointerChunk and pointerIndex point to the last
   * top-level node in the chunk tree, although pointerNode returns null.
   */
  private reachedEnd: boolean

  /**
   * The chunk containing the current node
   */
  private pointerChunk: ChunkAncestor

  /**
   * The index of the current node within pointerChunk
   *
   * Can be -1 to indicate that the pointer is before the start of the tree.
   */
  private pointerIndex: number

  /**
   * Similar to a Slate path; tracks the path of pointerChunk relative to the
   * root.
   *
   * Used to move the pointer from the current chunk to the parent chunk more
   * efficiently.
   */
  private pointerIndexStack: number[]

  /**
   * Indexing the current chunk's children has a slight time cost, which adds up
   * when traversing very large trees, so the current node is cached.
   *
   * A value of undefined means that the current node is not cached. This
   * property must be set to undefined whenever the pointer is moved, unless
   * the pointer is guaranteed to point to the same node that it did previously.
   */
  private cachedPointerNode: ChunkDescendant | null | undefined

  constructor(
    chunkTree: ChunkTree,
    { chunkSize, debug }: ChunkTreeHelperOptions
  ) {
    this.root = chunkTree
    this.chunkSize = chunkSize
    // istanbul ignore next
    this.debug = debug ?? false
    this.pointerChunk = chunkTree
    this.pointerIndex = -1
    this.pointerIndexStack = []
    this.reachedEnd = false
    this.validateState()
  }

  /**
   * Move the pointer to the next leaf in the chunk tree
   */
  public readLeaf(): ChunkLeaf | null {
    // istanbul ignore next
    if (this.reachedEnd) return null

    // Get the next sibling or aunt node
    while (true) {
      if (this.pointerIndex + 1 < this.pointerSiblings.length) {
        this.pointerIndex++
        this.cachedPointerNode = undefined
        break
      } else if (this.pointerChunk.type === 'root') {
        this.reachedEnd = true
        return null
      } else {
        this.exitChunk()
      }
    }

    this.validateState()

    // If the next sibling or aunt is a chunk, descend into it
    this.enterChunkUntilLeaf(false)

    return this.pointerNode as ChunkLeaf
  }

  /**
   * Move the pointer to the previous leaf in the chunk tree
   */
  public returnToPreviousLeaf() {
    // If we were at the end of the tree, descend into the end of the last
    // chunk in the tree
    if (this.reachedEnd) {
      this.reachedEnd = false
      this.enterChunkUntilLeaf(true)
      return
    }

    // Get the previous sibling or aunt node
    while (true) {
      if (this.pointerIndex >= 1) {
        this.pointerIndex--
        this.cachedPointerNode = undefined
        break
      } else if (this.pointerChunk.type === 'root') {
        this.pointerIndex = -1
        return
      } else {
        this.exitChunk()
      }
    }

    this.validateState()

    // If the previous sibling or aunt is a chunk, descend into it
    this.enterChunkUntilLeaf(true)
  }

  /**
   * Insert leaves before the current leaf, leaving the pointer unchanged
   */
  public insertBefore(leaves: ChunkLeaf[]) {
    this.returnToPreviousLeaf()
    this.insertAfter(leaves)
    this.readLeaf()
  }

  /**
   * Insert leaves after the current leaf, leaving the pointer on the last
   * inserted leaf
   *
   * The insertion algorithm first checks for any chunk we're currently at the
   * end of that can receive additional leaves. Next, it tries to insert leaves
   * at the starts of any subsequent chunks.
   *
   * Any remaining leaves are passed to rawInsertAfter to be chunked and
   * inserted at the highest possible level.
   */
  public insertAfter(leaves: ChunkLeaf[]) {
    // istanbul ignore next
    if (leaves.length === 0) return

    let beforeDepth = 0
    let afterDepth = 0

    // While at the end of a chunk, insert any leaves that will fit, and then
    // exit the chunk
    while (
      this.pointerChunk.type === 'chunk' &&
      this.pointerIndex === this.pointerSiblings.length - 1
    ) {
      const remainingCapacity = this.chunkSize - this.pointerSiblings.length
      const toInsertCount = Math.min(remainingCapacity, leaves.length)

      if (toInsertCount > 0) {
        const leavesToInsert = leaves.splice(0, toInsertCount)
        this.rawInsertAfter(leavesToInsert, beforeDepth)
      }

      this.exitChunk()
      beforeDepth++
    }

    if (leaves.length === 0) return

    // Save the pointer so that we can come back here after inserting leaves
    // into the starts of subsequent blocks
    const rawInsertPointer = this.savePointer()

    // If leaves are inserted into the start of a subsequent block, then we
    // eventually need to restore the pointer to the last such inserted leaf
    let finalPointer: SavedPointer | null = null

    // Move the pointer into the chunk containing the next leaf, if it exists
    if (this.readLeaf()) {
      // While at the start of a chunk, insert any leaves that will fit, and
      // then exit the chunk
      while (this.pointerChunk.type === 'chunk' && this.pointerIndex === 0) {
        const remainingCapacity = this.chunkSize - this.pointerSiblings.length
        const toInsertCount = Math.min(remainingCapacity, leaves.length)

        if (toInsertCount > 0) {
          const leavesToInsert = leaves.splice(-toInsertCount, toInsertCount)

          // Insert the leaves at the start of the chunk
          this.pointerIndex = -1
          this.cachedPointerNode = undefined
          this.rawInsertAfter(leavesToInsert, afterDepth)

          // If this is the first batch of insertions at the start of a
          // subsequent chunk, set the final pointer to the last inserted leaf
          if (!finalPointer) {
            finalPointer = this.savePointer()
          }
        }

        this.exitChunk()
        afterDepth++
      }
    }

    this.restorePointer(rawInsertPointer)

    // If there are leaves left to insert, insert them between the end of the
    // previous chunk and the start of the first subsequent chunk, or wherever
    // the pointer ended up after the first batch of insertions
    const minDepth = Math.max(beforeDepth, afterDepth)
    this.rawInsertAfter(leaves, minDepth)

    if (finalPointer) {
      this.restorePointer(finalPointer)
    }

    this.validateState()
  }

  /**
   * Remove the current node and decrement the pointer, deleting any ancestor
   * chunk that becomes empty as a result
   */
  public remove() {
    this.pointerSiblings.splice(this.pointerIndex--, 1)
    this.cachedPointerNode = undefined

    if (
      this.pointerSiblings.length === 0 &&
      this.pointerChunk.type === 'chunk'
    ) {
      this.exitChunk()
      this.remove()
    } else {
      this.invalidateChunk()
    }

    this.validateState()
  }

  /**
   * Add the current chunk and all ancestor chunks to the list of modified
   * chunks
   */
  public invalidateChunk() {
    for (let c = this.pointerChunk; c.type === 'chunk'; c = c.parent) {
      this.root.modifiedChunks.add(c)
    }
  }

  /**
   * Whether the pointer is at the start of the tree
   */
  private get atStart() {
    return this.pointerChunk.type === 'root' && this.pointerIndex === -1
  }

  /**
   * The siblings of the current node
   */
  private get pointerSiblings(): ChunkDescendant[] {
    return this.pointerChunk.children
  }

  /**
   * Get the current node (uncached)
   *
   * If the pointer is at the start or end of the document, returns null.
   *
   * Usually, the current node is a chunk leaf, although it can be a chunk
   * while insertions are in progress.
   */
  private getPointerNode(): ChunkDescendant | null {
    if (this.reachedEnd || this.pointerIndex === -1) {
      return null
    }

    return this.pointerSiblings[this.pointerIndex]
  }

  /**
   * Cached getter for the current node
   */
  private get pointerNode(): ChunkDescendant | null {
    if (this.cachedPointerNode !== undefined) return this.cachedPointerNode
    const pointerNode = this.getPointerNode()
    this.cachedPointerNode = pointerNode
    return pointerNode
  }

  /**
   * Get the path of a chunk relative to the root, returning null if the chunk
   * is not connected to the root
   */
  private getChunkPath(chunk: ChunkAncestor): number[] | null {
    const path: number[] = []

    for (let c = chunk; c.type === 'chunk'; c = c.parent) {
      const index = c.parent.children.indexOf(c)

      // istanbul ignore next
      if (index === -1) {
        return null
      }

      path.unshift(index)
    }

    return path
  }

  /**
   * Save the current pointer to be restored later
   */
  private savePointer(): SavedPointer {
    if (this.atStart) return 'start'

    // istanbul ignore next
    if (!this.pointerNode) {
      throw new Error('Cannot save pointer when pointerNode is null')
    }

    return {
      chunk: this.pointerChunk,
      node: this.pointerNode,
    }
  }

  /**
   * Restore the pointer to a previous state
   */
  private restorePointer(savedPointer: SavedPointer) {
    if (savedPointer === 'start') {
      this.pointerChunk = this.root
      this.pointerIndex = -1
      this.pointerIndexStack = []
      this.reachedEnd = false
      this.cachedPointerNode = undefined
      return
    }

    // Since nodes may have been inserted or removed prior to the saved
    // pointer since it was saved, the index and index stack must be
    // recomputed. This is slow, but this is fine since restoring a pointer is
    // not a frequent operation.

    const { chunk, node } = savedPointer
    const index = chunk.children.indexOf(node)

    // istanbul ignore next
    if (index === -1) {
      throw new Error(
        'Cannot restore point because saved node is no longer in saved chunk'
      )
    }

    const indexStack = this.getChunkPath(chunk)

    // istanbul ignore next
    if (!indexStack) {
      throw new Error(
        'Cannot restore point because saved chunk is no longer connected to root'
      )
    }

    this.pointerChunk = chunk
    this.pointerIndex = index
    this.pointerIndexStack = indexStack
    this.reachedEnd = false
    this.cachedPointerNode = node
    this.validateState()
  }

  /**
   * Assuming the current node is a chunk, move the pointer into that chunk
   *
   * @param end If true, place the pointer on the last node of the chunk.
   * Otherwise, place the pointer on the first node.
   */
  private enterChunk(end: boolean) {
    // istanbul ignore next
    if (this.pointerNode?.type !== 'chunk') {
      throw new Error('Cannot enter non-chunk')
    }

    this.pointerIndexStack.push(this.pointerIndex)
    this.pointerChunk = this.pointerNode
    this.pointerIndex = end ? this.pointerSiblings.length - 1 : 0
    this.cachedPointerNode = undefined
    this.validateState()

    // istanbul ignore next
    if (this.pointerChunk.children.length === 0) {
      throw new Error('Cannot enter empty chunk')
    }
  }

  /**
   * Assuming the current node is a chunk, move the pointer into that chunk
   * repeatedly until the current node is a leaf
   *
   * @param end If true, place the pointer on the last node of the chunk.
   * Otherwise, place the pointer on the first node.
   */
  private enterChunkUntilLeaf(end: boolean) {
    while (this.pointerNode?.type === 'chunk') {
      this.enterChunk(end)
    }
  }

  /**
   * Move the pointer to the parent chunk
   */
  private exitChunk() {
    // istanbul ignore next
    if (this.pointerChunk.type === 'root') {
      throw new Error('Cannot exit root')
    }

    const previousPointerChunk = this.pointerChunk
    this.pointerChunk = previousPointerChunk.parent
    this.pointerIndex = this.pointerIndexStack.pop()!
    this.cachedPointerNode = undefined
    this.validateState()
  }

  /**
   * Insert leaves immediately after the current node, leaving the pointer on
   * the last inserted leaf
   *
   * Leaves are chunked according to the number of nodes already in the parent
   * plus the number of nodes being inserted, or the minimum depth if larger
   */
  private rawInsertAfter(leaves: ChunkLeaf[], minDepth: number) {
    if (leaves.length === 0) return

    const groupIntoChunks = (
      leaves: ChunkLeaf[],
      parent: ChunkAncestor,
      perChunk: number
    ): ChunkDescendant[] => {
      if (perChunk === 1) return leaves
      const chunks: Chunk[] = []

      for (let i = 0; i < this.chunkSize; i++) {
        const chunkNodes = leaves.slice(i * perChunk, (i + 1) * perChunk)
        if (chunkNodes.length === 0) break

        const chunk: Chunk = {
          type: 'chunk',
          key: new Key(),
          parent,
          children: [],
        }

        chunk.children = groupIntoChunks(
          chunkNodes,
          chunk,
          perChunk / this.chunkSize
        )
        chunks.push(chunk)
      }

      return chunks
    }

    // Determine the chunking depth based on the number of existing nodes in
    // the chunk and the number of nodes being inserted
    const newTotal = this.pointerSiblings.length + leaves.length
    let depthForTotal = 0

    for (let i = this.chunkSize; i < newTotal; i *= this.chunkSize) {
      depthForTotal++
    }

    // A depth of 0 means no chunking
    const depth = Math.max(depthForTotal, minDepth)
    const perTopLevelChunk = Math.pow(this.chunkSize, depth)

    const chunks = groupIntoChunks(leaves, this.pointerChunk, perTopLevelChunk)
    this.pointerSiblings.splice(this.pointerIndex + 1, 0, ...chunks)
    this.pointerIndex += chunks.length
    this.cachedPointerNode = undefined
    this.invalidateChunk()
    this.validateState()
  }

  /**
   * If debug mode is enabled, ensure that the state is internally consistent
   */
  // istanbul ignore next
  private validateState() {
    if (!this.debug) return

    const validateDescendant = (node: ChunkDescendant) => {
      if (node.type === 'chunk') {
        const { parent, children } = node

        if (!parent.children.includes(node)) {
          throw new Error(
            `Debug: Chunk ${node.key.id} has an incorrect parent property`
          )
        }

        children.forEach(validateDescendant)
      }
    }

    this.root.children.forEach(validateDescendant)

    if (
      this.cachedPointerNode !== undefined &&
      this.cachedPointerNode !== this.getPointerNode()
    ) {
      throw new Error(
        'Debug: The cached pointer is incorrect and has not been invalidated'
      )
    }

    const actualIndexStack = this.getChunkPath(this.pointerChunk)

    if (!actualIndexStack) {
      throw new Error('Debug: The pointer chunk is not connected to the root')
    }

    if (!Path.equals(this.pointerIndexStack, actualIndexStack)) {
      throw new Error(
        `Debug: The cached index stack [${this.pointerIndexStack.join(
          ', '
        )}] does not match the path of the pointer chunk [${actualIndexStack.join(
          ', '
        )}]`
      )
    }
  }
}
