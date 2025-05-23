import { Descendant } from 'slate'
import { Key } from 'slate-dom'

export interface ChunkTree {
  type: 'root'
  children: ChunkDescendant[]

  /**
   * The keys of any Slate nodes that have been moved using move_node since the
   * last render
   *
   * Detecting when a node has been moved to a different position in the
   * children array is impossible to do efficiently while reconciling the chunk
   * tree. This interferes with the reconciliation logic since it is treated as
   * if the intermediate nodes were inserted and removed, causing them to be
   * re-chunked unnecessarily.
   *
   * This set is used to detect when a node has been moved so that this case
   * can be handled correctly and efficiently.
   */
  movedNodeKeys: Set<Key>

  /**
   * The chunks whose descendants have been modified during the most recent
   * reconciliation
   *
   * Used to determine when the otherwise memoized React components for each
   * chunk should be re-rendered.
   */
  modifiedChunks: Set<Chunk>
}

export interface Chunk {
  type: 'chunk'
  key: Key
  parent: ChunkAncestor
  children: ChunkDescendant[]
}

// A chunk leaf is unrelated to a Slate leaf; it is a leaf of the chunk tree,
// containing a single element that is a child of the Slate node the chunk tree
// belongs to.
export interface ChunkLeaf {
  type: 'leaf'
  key: Key
  node: Descendant
  index: number
}

export type ChunkAncestor = ChunkTree | Chunk
export type ChunkDescendant = Chunk | ChunkLeaf
export type ChunkNode = ChunkTree | Chunk | ChunkLeaf
