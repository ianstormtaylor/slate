import React, { useCallback, useRef } from 'react'
import { Ancestor, Editor, Element, DecoratedRange, Text } from 'slate'
import { Key, isElementDecorationsEqual } from 'slate-dom'
import {
  RenderChunkProps,
  RenderElementProps,
  RenderLeafProps,
  RenderPlaceholderProps,
  RenderTextProps,
} from '../components/editable'

import ElementComponent from '../components/element'
import TextComponent from '../components/text'
import { ReactEditor } from '../plugin/react-editor'
import {
  IS_NODE_MAP_DIRTY,
  NODE_TO_INDEX,
  NODE_TO_PARENT,
  splitDecorationsByChild,
} from 'slate-dom'
import { useSlateStatic } from './use-slate-static'
import { getChunkTreeForNode } from '../chunking'
import ChunkTree from '../components/chunk-tree'
import { ElementContext } from './use-element'

/**
 * Children.
 */

const useChildren = (props: {
  decorations: DecoratedRange[]
  node: Ancestor
  renderElement?: (props: RenderElementProps) => JSX.Element
  renderChunk?: (props: RenderChunkProps) => JSX.Element
  renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element
  renderText?: (props: RenderTextProps) => JSX.Element
  renderLeaf?: (props: RenderLeafProps) => JSX.Element
}) => {
  const {
    decorations,
    node,
    renderElement,
    renderChunk,
    renderPlaceholder,
    renderText,
    renderLeaf,
  } = props
  const editor = useSlateStatic()
  IS_NODE_MAP_DIRTY.set(editor as ReactEditor, false)

  const isEditor = Editor.isEditor(node)
  const isBlock = !isEditor && Element.isElement(node) && !editor.isInline(node)
  const isLeafBlock = isBlock && Editor.hasInlines(editor, node)
  const chunkSize = isLeafBlock ? null : editor.getChunkSize(node)
  const chunking = !!chunkSize

  const { decorationsByChild, childrenToRedecorate } = useDecorationsByChild(
    editor,
    node,
    decorations
  )

  // Update the index and parent of each child.
  // PERF: If chunking is enabled, this is done while traversing the chunk tree
  // instead to eliminate unnecessary weak map operations.
  if (!chunking) {
    node.children.forEach((n, i) => {
      NODE_TO_INDEX.set(n, i)
      NODE_TO_PARENT.set(n, node)
    })
  }

  const renderElementComponent = useCallback(
    (n: Element, i: number, cachedKey?: Key) => {
      const key = cachedKey ?? ReactEditor.findKey(editor, n)

      return (
        <ElementContext.Provider key={`provider-${key.id}`} value={n}>
          <ElementComponent
            decorations={decorationsByChild[i]}
            element={n}
            key={key.id}
            renderElement={renderElement}
            renderChunk={renderChunk}
            renderPlaceholder={renderPlaceholder}
            renderLeaf={renderLeaf}
            renderText={renderText}
          />
        </ElementContext.Provider>
      )
    },
    [
      editor,
      decorationsByChild,
      renderElement,
      renderChunk,
      renderPlaceholder,
      renderLeaf,
      renderText,
    ]
  )

  const renderTextComponent = (n: Text, i: number) => {
    const key = ReactEditor.findKey(editor, n)

    return (
      <TextComponent
        decorations={decorationsByChild[i]}
        key={key.id}
        isLast={i === node.children.length - 1}
        parent={node}
        renderPlaceholder={renderPlaceholder}
        renderLeaf={renderLeaf}
        renderText={renderText}
        text={n}
      />
    )
  }

  if (!chunking) {
    return node.children.map((n, i) =>
      Text.isText(n) ? renderTextComponent(n, i) : renderElementComponent(n, i)
    )
  }

  const chunkTree = getChunkTreeForNode(editor, node, {
    reconcile: {
      chunkSize,
      rerenderChildren: childrenToRedecorate,
      onInsert: (n, i) => {
        NODE_TO_INDEX.set(n, i)
        NODE_TO_PARENT.set(n, node)
      },
      onUpdate: (n, i) => {
        NODE_TO_INDEX.set(n, i)
        NODE_TO_PARENT.set(n, node)
      },
      onIndexChange: (n, i) => {
        NODE_TO_INDEX.set(n, i)
      },
    },
  })

  return (
    <ChunkTree
      root={chunkTree}
      ancestor={chunkTree}
      renderElement={renderElementComponent}
      renderChunk={renderChunk}
    />
  )
}

const useDecorationsByChild = (
  editor: Editor,
  node: Ancestor,
  decorations: DecoratedRange[]
) => {
  const decorationsByChild = splitDecorationsByChild(editor, node, decorations)

  // The value we return is a mutable array of `DecoratedRange[]` arrays. This
  // lets us avoid passing an immutable array of decorations for each child into
  // `ChunkTree` using props. Each `DecoratedRange[]` is only updated if the
  // decorations at that index have changed, which speeds up the equality check
  // for the `decorations` prop in the memoized `Element` and `Text` components.
  const mutableDecorationsByChild = useRef(decorationsByChild).current

  // Track the list of child indices whose decorations have changed, so that we
  // can tell the chunk tree to re-render these children.
  const childrenToRedecorate: number[] = []

  // Resize the mutable array to match the latest result
  mutableDecorationsByChild.length = decorationsByChild.length

  for (let i = 0; i < decorationsByChild.length; i++) {
    const decorations = decorationsByChild[i]

    const previousDecorations: DecoratedRange[] | null =
      mutableDecorationsByChild[i] ?? null

    if (!isElementDecorationsEqual(previousDecorations, decorations)) {
      mutableDecorationsByChild[i] = decorations
      childrenToRedecorate.push(i)
    }
  }

  return { decorationsByChild: mutableDecorationsByChild, childrenToRedecorate }
}

export default useChildren
