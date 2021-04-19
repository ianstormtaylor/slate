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

export interface TextTransforms {
  delete: (
    editor: Editor,
    options?: {
      at?: Location
      distance?: number
      unit?: 'character' | 'word' | 'line' | 'block'
      reverse?: boolean
      hanging?: boolean
      voids?: boolean
    }
  ) => void
  insertFragment: (
    editor: Editor,
    fragment: Node[],
    options?: {
      at?: Location
      hanging?: boolean
      voids?: boolean
    }
  ) => void
  insertText: (
    editor: Editor,
    text: string,
    options?: {
      at?: Location
      voids?: boolean
    }
  ) => void
}

export const TextTransforms: TextTransforms = {
  /**
   * Delete content in the editor.
   */

  delete(
    editor: Editor,
    options: {
      at?: Location
      distance?: number
      unit?: 'character' | 'word' | 'line' | 'block'
      reverse?: boolean
      hanging?: boolean
      voids?: boolean
    } = {}
  ): void {
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

      if (Range.isRange(at) && Range.isCollapsed(at)) {
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
        match: n => Editor.isBlock(editor, n),
        at: start,
        voids,
      })
      const endBlock = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n),
        at: end,
        voids,
      })
      const isAcrossBlocks =
        startBlock && endBlock && !Path.equals(startBlock[1], endBlock[1])
      const isSingleText = Path.equals(start.path, end.path)
      const startVoid = voids
        ? null
        : Editor.void(editor, { at: start, mode: 'highest' })
      const endVoid = voids
        ? null
        : Editor.void(editor, { at: end, mode: 'highest' })

      // If the start or end points are inside an inline void, nudge them out.
      if (startVoid) {
        const before = Editor.before(editor, start)

        if (
          before &&
          startBlock &&
          Path.isAncestor(startBlock[1], before.path)
        ) {
          start = before
        }
      }

      if (endVoid) {
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
          (!voids && Editor.isVoid(editor, node)) ||
          (!Path.isCommon(path, start.path) && !Path.isCommon(path, end.path))
        ) {
          matches.push(entry)
          lastPath = path
        }
      }

      const pathRefs = Array.from(matches, ([, p]) => Editor.pathRef(editor, p))
      const startRef = Editor.pointRef(editor, start)
      const endRef = Editor.pointRef(editor, end)

      if (!isSingleText && !startVoid) {
        const point = startRef.current!
        const [node] = Editor.leaf(editor, point)
        const { path } = point
        const { offset } = start
        const text = node.text.slice(offset)
        if (text.length > 0)
          editor.apply({ type: 'remove_text', path, offset, text })
      }

      for (const pathRef of pathRefs) {
        const path = pathRef.unref()!
        Transforms.removeNodes(editor, { at: path, voids })
      }

      if (!endVoid) {
        const point = endRef.current!
        const [node] = Editor.leaf(editor, point)
        const { path } = point
        const offset = isSingleText ? start.offset : 0
        const text = node.text.slice(offset, end.offset)
        if (text.length > 0)
          editor.apply({ type: 'remove_text', path, offset, text })
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

      const point = reverse
        ? startRef.unref() || endRef.unref()
        : endRef.unref() || startRef.unref()

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
    options: {
      at?: Location
      hanging?: boolean
      voids?: boolean
    } = {}
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
          at = Editor.unhangRange(editor, at)
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
        match: n => Editor.isInline(editor, n),
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
        match: n => Editor.isBlock(editor, n),
        at,
        voids,
      })!
      const [, blockPath] = blockMatch
      const isBlockStart = Editor.isStart(editor, at, blockPath)
      const isBlockEnd = Editor.isEnd(editor, at, blockPath)
      const mergeStart = !isBlockStart || (isBlockStart && isBlockEnd)
      const mergeEnd = !isBlockEnd
      const [, firstPath] = Node.first({ children: fragment }, [])
      const [, lastPath] = Node.last({ children: fragment }, [])

      const matches: NodeEntry[] = []
      const matcher = ([n, p]: NodeEntry) => {
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
        if (entry[1].length > 0 && matcher(entry)) {
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
        isBlockEnd ? Path.next(blockPath) : blockPath
      )

      const endRef = Editor.pathRef(
        editor,
        isInlineEnd ? Path.next(inlinePath) : inlinePath
      )

      Transforms.splitNodes(editor, {
        at,
        match: n =>
          hasBlocks
            ? Editor.isBlock(editor, n)
            : Text.isText(n) || Editor.isInline(editor, n),
        mode: hasBlocks ? 'lowest' : 'highest',
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

      Transforms.insertNodes(editor, middles, {
        at: middleRef.current!,
        match: n => Editor.isBlock(editor, n),
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

        if (ends.length > 0) {
          path = Path.previous(endRef.current!)
        } else if (middles.length > 0) {
          path = Path.previous(middleRef.current!)
        } else {
          path = Path.previous(startRef.current!)
        }

        const end = Editor.end(editor, path)
        Transforms.select(editor, end)
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
    options: {
      at?: Location
      voids?: boolean
    } = {}
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

          const pointRef = Editor.pointRef(editor, end)
          Transforms.delete(editor, { at, voids })
          at = pointRef.unref()!
          Transforms.setSelection(editor, { anchor: at, focus: at })
        }
      }

      if (!voids && Editor.void(editor, { at })) {
        return
      }

      const { path, offset } = at
      if (text.length > 0)
        editor.apply({ type: 'insert_text', path, offset, text })
    })
  },
}
