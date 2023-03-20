import {
  Editor,
  Element,
  Location,
  Node,
  NodeEntry,
  Path,
  Text,
  Point,
  Range,
  Transforms,
} from '..'
import { TextUnit } from '../interfaces/types'

export interface TextDeleteOptions {
  at?: Location
  distance?: number
  unit?: TextUnit
  reverse?: boolean
  hanging?: boolean
  voids?: boolean
}

export interface TextInsertFragmentOptions {
  at?: Location
  hanging?: boolean
  voids?: boolean
}

export interface TextInsertTextOptions {
  at?: Location
  voids?: boolean
}

export interface TextTransforms {
  delete: (editor: Editor, options?: TextDeleteOptions) => void
  insertFragment: (
    editor: Editor,
    fragment: Node[],
    options?: TextInsertFragmentOptions
  ) => void
  insertText: (
    editor: Editor,
    text: string,
    options?: TextInsertTextOptions
  ) => void
}

// eslint-disable-next-line no-redeclare
export const TextTransforms: TextTransforms = {
  /**
   * Delete content in the editor.
   */

  delete(editor: Editor, options: TextDeleteOptions = {}): void {
    Editor.withoutNormalizing(editor, () => {
      const {
        reverse = false,
        unit = 'character',
        distance = 1,
        voids = false,
      } = options
      let { at = editor.selection, hanging = false } = options

      if (!at) {
        return
      }

      let isCollapsed = false
      if (Range.isRange(at) && Range.isCollapsed(at)) {
        isCollapsed = true
        at = at.anchor
      }

      if (Point.isPoint(at)) {
        const furthestVoid = Editor.void(editor, { at, mode: 'highest' })

        if (!voids && furthestVoid) {
          const [, voidPath] = furthestVoid
          at = voidPath
        } else {
          const opts = { unit, distance }
          const target = reverse
            ? Editor.before(editor, at, opts) || Editor.start(editor, [])
            : Editor.after(editor, at, opts) || Editor.end(editor, [])
          at = { anchor: at, focus: target }
          hanging = true
        }
      }

      if (Path.isPath(at)) {
        Transforms.removeNodes(editor, { at, voids })
        return
      }

      if (Range.isCollapsed(at)) {
        return
      }

      if (!hanging) {
        const [, end] = Range.edges(at)
        const endOfDoc = Editor.end(editor, [])

        if (!Point.equals(end, endOfDoc)) {
          at = Editor.unhangRange(editor, at, { voids })
        }
      }

      let [start, end] = Range.edges(at)
      const startBlock = Editor.above(editor, {
        match: n => Element.isElement(n) && Editor.isBlock(editor, n),
        at: start,
        voids,
      })
      const endBlock = Editor.above(editor, {
        match: n => Element.isElement(n) && Editor.isBlock(editor, n),
        at: end,
        voids,
      })
      const isAcrossBlocks =
        startBlock && endBlock && !Path.equals(startBlock[1], endBlock[1])
      const isSingleText = Path.equals(start.path, end.path)
      const startNonEditable = voids
        ? null
        : Editor.void(editor, { at: start, mode: 'highest' }) ??
          Editor.elementReadOnly(editor, { at: start, mode: 'highest' })
      const endNonEditable = voids
        ? null
        : Editor.void(editor, { at: end, mode: 'highest' }) ??
          Editor.elementReadOnly(editor, { at: end, mode: 'highest' })

      // If the start or end points are inside an inline void, nudge them out.
      if (startNonEditable) {
        const before = Editor.before(editor, start)

        if (
          before &&
          startBlock &&
          Path.isAncestor(startBlock[1], before.path)
        ) {
          start = before
        }
      }

      if (endNonEditable) {
        const after = Editor.after(editor, end)

        if (after && endBlock && Path.isAncestor(endBlock[1], after.path)) {
          end = after
        }
      }

      // Get the highest nodes that are completely inside the range, as well as
      // the start and end nodes.
      const matches: NodeEntry[] = []
      let lastPath: Path | undefined

      for (const entry of Editor.nodes(editor, { at, voids })) {
        const [node, path] = entry

        if (lastPath && Path.compare(path, lastPath) === 0) {
          continue
        }

        if (
          (!voids &&
            Element.isElement(node) &&
            (Editor.isVoid(editor, node) ||
              Editor.isElementReadOnly(editor, node))) ||
          (!Path.isCommon(path, start.path) && !Path.isCommon(path, end.path))
        ) {
          matches.push(entry)
          lastPath = path
        }
      }

      const pathRefs = Array.from(matches, ([, p]) => Editor.pathRef(editor, p))
      const startRef = Editor.pointRef(editor, start)
      const endRef = Editor.pointRef(editor, end)

      let removedText = ''

      if (!isSingleText && !startNonEditable) {
        const point = startRef.current!
        const [node] = Editor.leaf(editor, point)
        const { path } = point
        const { offset } = start
        const text = node.text.slice(offset)
        if (text.length > 0) {
          editor.apply({ type: 'remove_text', path, offset, text })
          removedText = text
        }
      }

      pathRefs
        .reverse()
        .map(r => r.unref())
        .filter((r): r is Path => r !== null)
        .forEach(p => Transforms.removeNodes(editor, { at: p, voids }))

      if (!endNonEditable) {
        const point = endRef.current!
        const [node] = Editor.leaf(editor, point)
        const { path } = point
        const offset = isSingleText ? start.offset : 0
        const text = node.text.slice(offset, end.offset)
        if (text.length > 0) {
          editor.apply({ type: 'remove_text', path, offset, text })
          removedText = text
        }
      }

      if (
        !isSingleText &&
        isAcrossBlocks &&
        endRef.current &&
        startRef.current
      ) {
        Transforms.mergeNodes(editor, {
          at: endRef.current,
          hanging: true,
          voids,
        })
      }

      // For Thai script, deleting N character(s) backward should delete
      // N code point(s) instead of an entire grapheme cluster.
      // Therefore, the remaining code points should be inserted back.
      if (
        isCollapsed &&
        reverse &&
        unit === 'character' &&
        removedText.length > 1 &&
        removedText.match(/[\u0E00-\u0E7F]+/)
      ) {
        Transforms.insertText(
          editor,
          removedText.slice(0, removedText.length - distance)
        )
      }

      const startUnref = startRef.unref()
      const endUnref = endRef.unref()
      const point = reverse ? startUnref || endUnref : endUnref || startUnref

      if (options.at == null && point) {
        Transforms.select(editor, point)
      }
    })
  },

  /**
   * Insert a fragment at a specific location in the editor.
   */

  insertFragment(
    editor: Editor,
    fragment: Node[],
    options: TextInsertFragmentOptions = {}
  ): void {
    Editor.withoutNormalizing(editor, () => {
      const { hanging = false, voids = false } = options
      let { at = editor.selection } = options

      if (!fragment.length) {
        return
      }

      if (!at) {
        return
      } else if (Range.isRange(at)) {
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
      const mergeStart = !isBlockStart || (isBlockStart && isBlockEnd)
      const mergeEnd = !isBlockEnd
      const [, firstPath] = Node.first({ children: fragment }, [])
      const [, lastPath] = Node.last({ children: fragment }, [])

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

        if (
          mergeEnd &&
          Path.isAncestor(p, lastPath) &&
          Element.isElement(n) &&
          !editor.isVoid(n) &&
          !editor.isInline(n)
        ) {
          return false
        }

        return true
      }

      for (const entry of Node.nodes(
        { children: fragment },
        { pass: matcher }
      )) {
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
          Transforms.select(editor, end)
        }
      }

      startRef.unref()
      middleRef.unref()
      endRef.unref()
    })
  },

  /**
   * Insert a string of text in the Editor.
   */

  insertText(
    editor: Editor,
    text: string,
    options: TextInsertTextOptions = {}
  ): void {
    Editor.withoutNormalizing(editor, () => {
      const { voids = false } = options
      let { at = editor.selection } = options

      if (!at) {
        return
      }

      if (Path.isPath(at)) {
        at = Editor.range(editor, at)
      }

      if (Range.isRange(at)) {
        if (Range.isCollapsed(at)) {
          at = at.anchor
        } else {
          const end = Range.end(at)
          if (!voids && Editor.void(editor, { at: end })) {
            return
          }
          const start = Range.start(at)
          const startRef = Editor.pointRef(editor, start)
          const endRef = Editor.pointRef(editor, end)
          Transforms.delete(editor, { at, voids })
          const startPoint = startRef.unref()
          const endPoint = endRef.unref()

          at = startPoint || endPoint!
          Transforms.setSelection(editor, { anchor: at, focus: at })
        }
      }

      if (
        (!voids && Editor.void(editor, { at })) ||
        Editor.elementReadOnly(editor, { at })
      ) {
        return
      }

      const { path, offset } = at
      if (text.length > 0)
        editor.apply({ type: 'insert_text', path, offset, text })
    })
  },
}
