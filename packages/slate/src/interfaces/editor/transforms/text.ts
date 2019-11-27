import {
  Editor,
  Element,
  Location,
  Node,
  NodeEntry,
  Path,
  Point,
  Range,
} from '../../..'

export const TextTransforms = {
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
    } = {}
  ) {
    Editor.withoutNormalizing(editor, () => {
      const { reverse = false, unit = 'character', distance = 1 } = options
      let { at = editor.selection, hanging = false } = options

      if (!at) {
        return
      }

      if (Range.isRange(at) && Range.isCollapsed(at)) {
        at = at.anchor
      }

      if (Point.isPoint(at)) {
        const furthestVoid = Editor.match(editor, at.path, 'void')

        if (furthestVoid) {
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
        Editor.removeNodes(editor, { at })
        return
      }

      if (Range.isCollapsed(at)) {
        return
      }

      if (!hanging) {
        at = Editor.unhangRange(editor, at)
      }

      let [start, end] = Range.edges(at)
      const [ancestor] = Editor.ancestor(editor, at)
      const isSingleText = Path.equals(start.path, end.path)
      const startVoid = Editor.match(editor, start.path, 'void')
      const endVoid = Editor.match(editor, end.path, 'void')

      // If the start or end points are inside an inline void, nudge them out.
      if (startVoid) {
        const block = Editor.match(editor, start.path, 'block')
        const before = Editor.before(editor, start)

        if (before && block && Path.isAncestor(block[1], before.path)) {
          start = before
        }
      }

      if (endVoid) {
        const block = Editor.match(editor, end.path, 'block')
        const after = Editor.after(editor, end)

        if (after && block && Path.isAncestor(block[1], after.path)) {
          end = after
        }
      }

      // Get the highest nodes that are completely inside the range, as well as
      // the start and end nodes.
      const matches = Editor.matches(editor, {
        at,
        match: ([n, p]) =>
          (Element.isElement(n) && editor.isVoid(n)) ||
          (!Path.isCommon(p, start.path) && !Path.isCommon(p, end.path)),
      })

      const pathRefs = Array.from(matches, ([, p]) => Editor.pathRef(editor, p))
      const startRef = Editor.pointRef(editor, start)
      const endRef = Editor.pointRef(editor, end)

      if (!isSingleText && !startVoid) {
        const point = startRef.current!
        const [node] = Editor.leaf(editor, point)
        const { path } = point
        const { offset } = start
        const text = node.text.slice(offset)
        editor.apply({ type: 'remove_text', path, offset, text })
      }

      for (const pathRef of pathRefs) {
        const path = pathRef.unref()!
        Editor.removeNodes(editor, { at: path })
      }

      if (!endVoid) {
        const point = endRef.current!
        const [node] = Editor.leaf(editor, point)
        const { path } = point
        const offset = isSingleText ? start.offset : 0
        const text = node.text.slice(offset, end.offset)
        editor.apply({ type: 'remove_text', path, offset, text })
      }

      const isBlockAncestor =
        Editor.isEditor(ancestor) ||
        (Element.isElement(ancestor) && !editor.isInline(ancestor))

      if (
        !isSingleText &&
        isBlockAncestor &&
        endRef.current &&
        startRef.current
      ) {
        Editor.mergeNodes(editor, { at: endRef.current, hanging: true })
      }

      const point = endRef.unref() || startRef.unref()

      if (options.at == null && point) {
        Editor.select(editor, point)
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
    } = {}
  ) {
    Editor.withoutNormalizing(editor, () => {
      let { at = editor.selection } = options
      const { hanging = false } = options

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
          const pointRef = Editor.pointRef(editor, end)
          Editor.delete(editor, { at })
          at = pointRef.unref()!
        }
      } else if (Path.isPath(at)) {
        at = Editor.start(editor, at)
      }

      if (Editor.match(editor, at.path, 'void')) {
        return
      }

      // If the insert point is at the edge of an inline node, move it outside
      // instead since it will need to be split otherwise.
      const inlineElementMatch = Editor.match(editor, at, 'inline-element')

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

      const blockMatch = Editor.match(editor, at, 'block')!
      const [, blockPath] = blockMatch
      const isBlockStart = Editor.isStart(editor, at, blockPath)
      const isBlockEnd = Editor.isEnd(editor, at, blockPath)
      const mergeStart = !isBlockStart || (isBlockStart && isBlockEnd)
      const mergeEnd = !isBlockEnd
      const [, firstPath] = Node.first({ children: fragment }, [])
      const [, lastPath] = Node.last({ children: fragment }, [])

      // TODO: convert into a proper `Nodes.matches` iterable
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

      const inlineMatch = Editor.match(editor, at, 'inline')!
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

      Editor.splitNodes(editor, { at, match: hasBlocks ? 'block' : 'inline' })

      const startRef = Editor.pathRef(
        editor,
        !isInlineStart || (isInlineStart && isInlineEnd)
          ? Path.next(inlinePath)
          : inlinePath
      )

      Editor.insertNodes(editor, starts, {
        at: startRef.current!,
        match: 'inline',
      })
      Editor.insertNodes(editor, middles, {
        at: middleRef.current!,
        match: 'block',
      })
      Editor.insertNodes(editor, ends, { at: endRef.current!, match: 'inline' })

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
        Editor.select(editor, end)
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
      at?: Point | Range
    } = {}
  ) {
    Editor.withoutNormalizing(editor, () => {
      const { selection } = editor
      let { at } = options

      if (!at && selection) {
        at = selection
      }

      if (Range.isRange(at)) {
        if (Range.isCollapsed(at)) {
          at = at.anchor
        } else {
          const pointRef = Editor.pointRef(editor, Range.end(at))
          Editor.delete(editor, { at })
          at = pointRef.unref()!
        }
      }

      if (Point.isPoint(at) && !Editor.match(editor, at.path, 'void')) {
        const { path, offset } = at
        editor.apply({ type: 'insert_text', path, offset, text })
      }
    })
  },
}
