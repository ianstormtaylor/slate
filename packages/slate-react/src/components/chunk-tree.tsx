import React, { Fragment } from 'react'
import { Element } from 'slate'
import { Key } from 'slate-dom'
import { RenderChunkProps } from './editable'
import {
  Chunk as TChunk,
  ChunkAncestor as TChunkAncestor,
  ChunkTree as TChunkTree,
} from '../chunking'

const defaultRenderChunk = ({ children }: RenderChunkProps) => children

const ChunkAncestor = <C extends TChunkAncestor>(props: {
  root: TChunkTree
  ancestor: C
  renderElement: (node: Element, index: number, key: Key) => JSX.Element
  renderChunk?: (props: RenderChunkProps) => JSX.Element
}) => {
  const {
    root,
    ancestor,
    renderElement,
    renderChunk = defaultRenderChunk,
  } = props

  return ancestor.children.map(chunkNode => {
    if (chunkNode.type === 'chunk') {
      const key = chunkNode.key.id

      const renderedChunk = renderChunk({
        highest: ancestor === root,
        lowest: chunkNode.children.some(c => c.type === 'leaf'),
        attributes: { 'data-slate-chunk': true },
        children: (
          <MemoizedChunk
            root={root}
            ancestor={chunkNode}
            renderElement={renderElement}
            renderChunk={renderChunk}
          />
        ),
      })

      return <Fragment key={key}>{renderedChunk}</Fragment>
    }

    // Only blocks containing no inlines are chunked
    const element = chunkNode.node as Element

    return renderElement(element, chunkNode.index, chunkNode.key)
  })
}

const ChunkTree = ChunkAncestor<TChunkTree>

const MemoizedChunk = React.memo(
  ChunkAncestor<TChunk>,
  (prev, next) =>
    prev.root === next.root &&
    prev.renderElement === next.renderElement &&
    prev.renderChunk === next.renderChunk &&
    !next.root.modifiedChunks.has(next.ancestor)
)

export default ChunkTree
