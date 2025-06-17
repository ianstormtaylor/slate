import { Editor, Descendant } from 'slate'
import { Key } from 'slate-dom'
import { ChunkLeaf } from './types'
import { ReactEditor } from '../plugin/react-editor'

/**
 * Traverse an array of children, providing helpers useful for reconciling the
 * children array with a chunk tree
 */
export class ChildrenHelper {
  private editor: Editor
  private children: Descendant[]

  /**
   * Sparse array of Slate node keys, each index corresponding to an index in
   * the children array
   *
   * Fetching the key for a Slate node is expensive, so we cache them here.
   */
  private cachedKeys: Array<Key | undefined>

  /**
   * The index of the next node to be read in the children array
   */
  public pointerIndex: number

  constructor(editor: Editor, children: Descendant[]) {
    this.editor = editor
    this.children = children
    this.cachedKeys = new Array(children.length)
    this.pointerIndex = 0
  }

  /**
   * Read a given number of nodes, advancing the pointer by that amount
   */
  public read(n: number): Descendant[] {
    // PERF: If only one child was requested (the most common case), use array
    // indexing instead of slice
    if (n === 1) {
      return [this.children[this.pointerIndex++]]
    }

    const slicedChildren = this.remaining(n)
    this.pointerIndex += n

    return slicedChildren
  }

  /**
   * Get the remaining children without advancing the pointer
   *
   * @param [maxChildren] Limit the number of children returned.
   */
  public remaining(maxChildren?: number): Descendant[] {
    if (maxChildren === undefined) {
      return this.children.slice(this.pointerIndex)
    }

    return this.children.slice(
      this.pointerIndex,
      this.pointerIndex + maxChildren
    )
  }

  /**
   * Whether all children have been read
   */
  public get reachedEnd() {
    return this.pointerIndex >= this.children.length
  }

  /**
   * Determine whether a node with a given key appears in the unread part of the
   * children array, and return its index relative to the current pointer if so
   *
   * Searching for the node object itself using indexOf is most efficient, but
   * will fail to locate nodes that have been modified. In this case, nodes
   * should be identified by their keys instead.
   *
   * Searching an array of keys using indexOf is very inefficient since fetching
   * the keys for all children in advance is very slow. Insead, if the node
   * search fails to return a value, fetch the keys of each remaining child one
   * by one and compare it to the known key.
   */
  public lookAhead(node: Descendant, key: Key) {
    const elementResult = this.children.indexOf(node, this.pointerIndex)
    if (elementResult > -1) return elementResult - this.pointerIndex

    for (let i = this.pointerIndex; i < this.children.length; i++) {
      const candidateNode = this.children[i]
      const candidateKey = this.findKey(candidateNode, i)
      if (candidateKey === key) return i - this.pointerIndex
    }

    return -1
  }

  /**
   * Convert an array of Slate nodes to an array of chunk leaves, each
   * containing the node and its key
   */
  public toChunkLeaves(nodes: Descendant[], startIndex: number): ChunkLeaf[] {
    return nodes.map((node, i) => ({
      type: 'leaf',
      node,
      key: this.findKey(node, startIndex + i),
      index: startIndex + i,
    }))
  }

  /**
   * Get the key for a Slate node, cached using the node's index
   */
  private findKey(node: Descendant, index: number): Key {
    const cachedKey = this.cachedKeys[index]
    if (cachedKey) return cachedKey
    const key = ReactEditor.findKey(this.editor, node)
    this.cachedKeys[index] = key
    return key
  }
}
