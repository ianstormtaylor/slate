import { Editor } from '../interfaces/editor'
import { Element } from '../interfaces/element'
import { Point } from '../interfaces/index'
import { Node, NodeEntry } from '../interfaces/node'
import { Path } from '../interfaces/path'
import { Range } from '../interfaces/range'
import { Text } from '../interfaces/text'
import { Transforms } from '../interfaces/transforms'
import { TextTransforms } from '../interfaces/transforms/text'
import { getDefaultInsertLocation } from '../utils'

export const insertFragment: TextTransforms['insertFragment'] = (
  editor,
  fragment,
  options = {}
) => {
  Editor.withoutNormalizing(editor, () => {
    const { hanging = false, voids = false } = options
    let { at = getDefaultInsertLocation(editor) } = options

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
      const _at = Editor.start(editor, at)
      if (!_at) {
        editor.onError({
          key: 'insertFragment.start',
          message: `Cannot find start point to insert fragment at path [${at}].`,
          data: { at, fragment },
        })
        return
      }
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

      if (Editor.isEnd(editor, at as Point, inlinePath)) {
        at = Editor.after(editor, inlinePath)!
        if (!at) {
          editor.onError({
            key: 'insertFragment.after',
            message: `Cannot find end point to insert fragment after inline at path [${inlinePath}].`,
            data: { at, fragment },
          })
          return
        }
      } else if (Editor.isStart(editor, at as Point, inlinePath)) {
        at = Editor.before(editor, inlinePath)!
        if (!at) {
          editor.onError({
            key: 'insertFragment.before',
            message: `Cannot find start point to insert fragment before inline at path [${inlinePath}].`,
            data: { at, fragment },
          })
          return
        }
      }
    }

    const blockMatch = Editor.above(editor, {
      match: n => Element.isElement(n) && Editor.isBlock(editor, n),
      at,
      voids,
    })!
    const [, blockPath] = blockMatch
    const isBlockStart = Editor.isStart(editor, at as Point, blockPath)
    const isBlockEnd = Editor.isEnd(editor, at as Point, blockPath)
    const isBlockEmpty = isBlockStart && isBlockEnd
    const mergeStart = !isBlockStart || (isBlockStart && isBlockEnd)
    const mergeEnd = !isBlockEnd
    const firstEntry = Node.first({ children: fragment }, [])
    if (!firstEntry) {
      editor.onError({
        key: 'insertFragment.first',
        message: `Cannot find first point to insert fragment at path [${at}].`,
        data: { at, fragment },
      })
      return
    }
    const [, firstPath] = firstEntry

    const lastEntry = Node.last({ children: fragment }, [])
    if (!lastEntry) {
      editor.onError({
        key: 'insertFragment.last',
        message: `Cannot find last point to insert fragment at path [${at}].`,
        data: { at, fragment },
      })
      return
    }
    const [, lastPath] = lastEntry

    const matches: NodeEntry[] = []
    const matcher = ([n, p]: NodeEntry) => {
      const isRoot = p.length === 0
      if (isRoot) {
        return false
      }

      if (isBlockEmpty) {
        return true
      }

      if (
        mergeStart &&
        Path.isAncestor(p, firstPath) &&
        Element.isElement(n) &&
        !editor.isVoid(n) &&
        !editor.isInline(n)
      ) {
        return false
      }

      return !(
        mergeEnd &&
        Path.isAncestor(p, lastPath) &&
        Element.isElement(n) &&
        !editor.isVoid(n) &&
        !editor.isInline(n)
      )
    }

    for (const entry of Node.nodes({ children: fragment }, { pass: matcher })) {
      if (matcher(entry)) {
        matches.push(entry)
      }
    }

    const starts = []
    const middles = []
    const ends = []
    let starting = true
    let hasBlocks = false

    for (const [node] of matches) {
      if (Element.isElement(node) && !editor.isInline(node)) {
        starting = false
        hasBlocks = true
        middles.push(node)
      } else if (starting) {
        starts.push(node)
      } else {
        ends.push(node)
      }
    }

    const [inlineMatch] = Editor.nodes(editor, {
      at,
      match: n => Text.isText(n) || Editor.isInline(editor, n),
      mode: 'highest',
      voids,
    })!

    const [, inlinePath] = inlineMatch
    const isInlineStart = Editor.isStart(editor, at as Point, inlinePath)
    const isInlineEnd = Editor.isEnd(editor, at as Point, inlinePath)

    const middlePath =
      isBlockEnd && !ends.length ? Path.next(blockPath) : blockPath
    if (!middlePath) {
      editor.onError({
        key: 'insertFragment.middlePath',
        message: `Cannot find middle point to insert fragment at path [${at}].`,
        data: { at, fragment },
      })
      return
    }

    const middleRef = Editor.pathRef(editor, middlePath)

    const endPath = isInlineEnd ? Path.next(inlinePath) : inlinePath
    if (!endPath) {
      editor.onError({
        key: 'insertFragment.endPath',
        message: `Cannot find end point to insert fragment at path [${at}].`,
        data: { at, fragment },
      })
      return
    }

    const endRef = Editor.pathRef(editor, endPath)

    Transforms.splitNodes(editor, {
      at,
      match: n =>
        hasBlocks
          ? Element.isElement(n) && Editor.isBlock(editor, n)
          : Text.isText(n) || Editor.isInline(editor, n),
      mode: hasBlocks ? 'lowest' : 'highest',
      always:
        hasBlocks &&
        (!isBlockStart || starts.length > 0) &&
        (!isBlockEnd || ends.length > 0),
      voids,
    })

    const startPath =
      !isInlineStart || (isInlineStart && isInlineEnd)
        ? Path.next(inlinePath)
        : inlinePath
    if (!startPath) {
      editor.onError({
        key: 'insertFragment.startPath',
        message: `Cannot find start point to insert fragment at path [${at}].`,
        data: { at, fragment },
      })
      return
    }

    const startRef = Editor.pathRef(editor, startPath)

    Transforms.insertNodes(editor, starts, {
      at: startRef.current!,
      match: n => Text.isText(n) || Editor.isInline(editor, n),
      mode: 'highest',
      voids,
    })

    if (isBlockEmpty && !starts.length && middles.length && !ends.length) {
      Transforms.delete(editor, { at: blockPath, voids })
    }

    Transforms.insertNodes(editor, middles, {
      at: middleRef.current!,
      match: n => Element.isElement(n) && Editor.isBlock(editor, n),
      mode: 'lowest',
      voids,
    })

    Transforms.insertNodes(editor, ends, {
      at: endRef.current!,
      match: n => Text.isText(n) || Editor.isInline(editor, n),
      mode: 'highest',
      voids,
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
        if (!end) {
          editor.onError({
            key: 'insertFragment.end',
            message: `Cannot find end point to insert fragment at path [${at}].`,
            data: { at, fragment },
          })
          return
        }
        Transforms.select(editor, end)
      }
    }

    startRef.unref()
    middleRef.unref()
    endRef.unref()
  })
}
