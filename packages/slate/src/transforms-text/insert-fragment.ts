import { Transforms } from '../interfaces/transforms'
import { Editor } from '../interfaces/editor'
import { Range } from '../interfaces/range'
import { Path } from '../interfaces/path'
import { Element } from '../interfaces/element'
import { Descendant, Node, NodeEntry } from '../interfaces/node'
import { Text } from '../interfaces/text'
import { TextTransforms } from '../interfaces/transforms/text'
import { getDefaultInsertLocation } from '../utils'

export const insertFragment: TextTransforms['insertFragment'] = (
  editor,
  fragment,
  options = {}
) => {
  Editor.withoutNormalizing(editor, () => {
    const { hanging = false, voids = false } = options
    let { at = getDefaultInsertLocation(editor), batchDirty = true } = options

    if (!fragment.length) {
      return
    }

    if (Range.isRange(at)) {
      if (!hanging) {
        at = Editor.unhangRange(editor, at, { voids })
      }

      if (Range.isCollapsed(at)) {
        at = at.anchor
      } else {
        const [, end] = Range.edges(at)

        if (!voids && Editor.void(editor, { at: end })) {
          return
        }

        const pointRef = Editor.pointRef(editor, end)
        Transforms.delete(editor, { at })
        at = pointRef.unref()!
      }
    } else if (Path.isPath(at)) {
      at = Editor.start(editor, at)
    }

    if (!voids && Editor.void(editor, { at })) {
      return
    }

    // If the insert point is at the edge of an inline node, move it outside
    // instead since it will need to be split otherwise.
    const inlineElementMatch = Editor.above(editor, {
      at,
      match: n => Element.isElement(n) && Editor.isInline(editor, n),
      mode: 'highest',
      voids,
    })

    if (inlineElementMatch) {
      const [, inlinePath] = inlineElementMatch

      if (Editor.isEnd(editor, at, inlinePath)) {
        const after = Editor.after(editor, inlinePath)!
        at = after
      } else if (Editor.isStart(editor, at, inlinePath)) {
        const before = Editor.before(editor, inlinePath)!
        at = before
      }
    }

    const blockMatch = Editor.above(editor, {
      match: n => Element.isElement(n) && Editor.isBlock(editor, n),
      at,
      voids,
    })!
    const [, blockPath] = blockMatch
    const isBlockStart = Editor.isStart(editor, at, blockPath)
    const isBlockEnd = Editor.isEnd(editor, at, blockPath)
    const isBlockEmpty = isBlockStart && isBlockEnd
    const [, firstLeafPath] = Node.first({ children: fragment }, [])
    const [, lastLeafPath] = Node.last({ children: fragment }, [])

    // For each node in the fragment, determine what level of wrapping should
    // be kept. At minimum, all text nodes will be inserted, but if
    // `shouldInsert` returns true for some ancestor of a particular text node,
    // then the entire ancestor will be inserted rather than inserting the text
    // nodes individually.
    const shouldInsert = ([n, p]: NodeEntry) => {
      const isRoot = p.length === 0
      if (isRoot) {
        return false
      }

      // If the destination block is empty, insert all top-level blocks of the
      // fragment.
      if (isBlockEmpty) {
        return true
      }

      // Unless we're at the start of the destination block, unwrap any
      // non-void blocks that contain the first leaf node in the fragment.
      if (
        !isBlockStart &&
        Path.isAncestor(p, firstLeafPath) &&
        Element.isElement(n) &&
        !editor.isVoid(n) &&
        !editor.isInline(n)
      ) {
        return false
      }

      // Unless we're at the end of the destination block, unwrap any non-void
      // blocks that contain the last leaf node in the fragment.
      if (
        !isBlockEnd &&
        Path.isAncestor(p, lastLeafPath) &&
        Element.isElement(n) &&
        !editor.isVoid(n) &&
        !editor.isInline(n)
      ) {
        return false
      }

      // Always insert void nodes, inline elements and text nodes.
      return true
    }

    // Whether the current node is in the first block of the fragment.
    let starting = true

    // Inline nodes in the first block of the fragment, to be merged with the
    // destination block.
    const starts: Descendant[] = []

    // Blocks in the middle of the fragment.
    const middles: Element[] = []

    // Inline nodes in the last block of the fragment, to be merged with the
    // destination block. If the fragment contains only one block, this will be
    // empty.
    const ends: Descendant[] = []

    for (const entry of Node.nodes(
      { children: fragment },
      { pass: shouldInsert }
    )) {
      const [node, path] = entry

      // If we encounter a block that does not contain the first leaf, we're no
      // longer in the first block of the fragment.
      if (
        starting &&
        Element.isElement(node) &&
        !editor.isInline(node) &&
        !Path.isAncestor(path, firstLeafPath)
      ) {
        starting = false
      }

      if (shouldInsert(entry)) {
        if (Element.isElement(node) && !editor.isInline(node)) {
          starting = false
          middles.push(node)
        } else if (starting) {
          starts.push(node)
        } else {
          ends.push(node)
        }
      }
    }

    const [inlineMatch] = Editor.nodes(editor, {
      at,
      match: n => Text.isText(n) || Editor.isInline(editor, n),
      mode: 'highest',
      voids,
    })!

    const [, inlinePath] = inlineMatch
    const isInlineStart = Editor.isStart(editor, at, inlinePath)
    const isInlineEnd = Editor.isEnd(editor, at, inlinePath)

    const middleRef = Editor.pathRef(
      editor,
      isBlockEnd && !ends.length ? Path.next(blockPath) : blockPath
    )

    const endRef = Editor.pathRef(
      editor,
      isInlineEnd ? Path.next(inlinePath) : inlinePath
    )

    // If the fragment contains inlines in multiple distinct blocks, split the
    // destination block.
    const splitBlock = ends.length > 0

    Transforms.splitNodes(editor, {
      at,
      match: n =>
        splitBlock
          ? Element.isElement(n) && Editor.isBlock(editor, n)
          : Text.isText(n) || Editor.isInline(editor, n),
      mode: splitBlock ? 'lowest' : 'highest',
      always:
        splitBlock &&
        (!isBlockStart || starts.length > 0) &&
        (!isBlockEnd || ends.length > 0),
      voids,
    })

    const startRef = Editor.pathRef(
      editor,
      !isInlineStart || (isInlineStart && isInlineEnd)
        ? Path.next(inlinePath)
        : inlinePath
    )

    Transforms.insertNodes(editor, starts, {
      at: startRef.current!,
      match: n => Text.isText(n) || Editor.isInline(editor, n),
      mode: 'highest',
      voids,
      batchDirty,
    })

    if (isBlockEmpty && !starts.length && middles.length && !ends.length) {
      Transforms.delete(editor, { at: blockPath, voids })
    }

    Transforms.insertNodes(editor, middles, {
      at: middleRef.current!,
      match: n => Element.isElement(n) && Editor.isBlock(editor, n),
      mode: 'lowest',
      voids,
      batchDirty,
    })

    Transforms.insertNodes(editor, ends, {
      at: endRef.current!,
      match: n => Text.isText(n) || Editor.isInline(editor, n),
      mode: 'highest',
      voids,
      batchDirty,
    })

    if (!options.at) {
      let path

      if (ends.length > 0 && endRef.current) {
        path = Path.previous(endRef.current)
      } else if (middles.length > 0 && middleRef.current) {
        path = Path.previous(middleRef.current)
      } else if (startRef.current) {
        path = Path.previous(startRef.current)
      }

      if (path) {
        const end = Editor.end(editor, path)
        Transforms.select(editor, end)
      }
    }

    startRef.unref()
    middleRef.unref()
    endRef.unref()
  })
}
