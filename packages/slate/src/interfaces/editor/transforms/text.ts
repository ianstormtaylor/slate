import {
  Editor,
  Element,
  Location,
  Node,
  NodeEntry,
  Path,
  Point,
  Range,
  Value,
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
      let { at = editor.value.selection, hanging = false } = options

      if (!at) {
        return
      }

      if (Range.isRange(at) && Range.isCollapsed(at)) {
        at = at.anchor
      }

      if (Point.isPoint(at)) {
        const furthestVoid = Editor.getMatch(editor, at.path, 'void')

        if (furthestVoid) {
          const [, voidPath] = furthestVoid
          at = voidPath
        } else {
          const opts = { unit, distance }
          const target = reverse
            ? Editor.getBefore(editor, at, opts) || Editor.getStart(editor, [])
            : Editor.getAfter(editor, at, opts) || Editor.getEnd(editor, [])
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
      const [ancestor] = Editor.getAncestor(editor, at)
      const isSingleText = Path.equals(start.path, end.path)
      const startVoid = Editor.getMatch(editor, start.path, 'void')
      const endVoid = Editor.getMatch(editor, end.path, 'void')

      // If the start or end points are inside an inline void, nudge them out.
      if (startVoid) {
        const block = Editor.getMatch(editor, start.path, 'block')
        const before = Editor.getBefore(editor, start)

        if (before && block && Path.isAncestor(block[1], before.path)) {
          start = before
        }
      }

      if (endVoid) {
        const block = Editor.getMatch(editor, end.path, 'block')
        const after = Editor.getAfter(editor, end)

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

      const pathRefs = Array.from(matches, ([, p]) =>
        Editor.createPathRef(editor, p)
      )
      const startRef = Editor.createPointRef(editor, start)
      const endRef = Editor.createPointRef(editor, end)

      if (!isSingleText && !startVoid) {
        const point = startRef.current!
        const [node] = Editor.getLeaf(editor, point)
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
        const [node] = Editor.getLeaf(editor, point)
        const { path } = point
        const offset = isSingleText ? start.offset : 0
        const text = node.text.slice(offset, end.offset)
        editor.apply({ type: 'remove_text', path, offset, text })
      }

      const isBlockAncestor =
        Value.isValue(ancestor) ||
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
      let { at = editor.value.selection } = options
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
          const pointRef = Editor.createPointRef(editor, end)
          Editor.delete(editor, { at })
          at = pointRef.unref()!
        }
      } else if (Path.isPath(at)) {
        at = Editor.getStart(editor, at)
      }

      if (Editor.getMatch(editor, at.path, 'void')) {
        return
      }

      // If the insert point is at the edge of an inline node, move it outside
      // instead since it will need to be split otherwise.
      const inlineElementMatch = Editor.getMatch(editor, at, 'inline-element')

      if (inlineElementMatch) {
        const [, inlinePath] = inlineElementMatch

        if (Editor.isEnd(editor, at, inlinePath)) {
          const after = Editor.getAfter(editor, inlinePath)!
          at = after
        } else if (Editor.isStart(editor, at, inlinePath)) {
          const before = Editor.getBefore(editor, inlinePath)!
          at = before
        }
      }

      const blockMatch = Editor.getMatch(editor, at, 'block')!
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

      const inlineMatch = Editor.getMatch(editor, at, 'inline')!
      const [, inlinePath] = inlineMatch
      const isInlineStart = Editor.isStart(editor, at, inlinePath)
      const isInlineEnd = Editor.isEnd(editor, at, inlinePath)

      const middleRef = Editor.createPathRef(
        editor,
        isBlockEnd ? Path.next(blockPath) : blockPath
      )

      const endRef = Editor.createPathRef(
        editor,
        isInlineEnd ? Path.next(inlinePath) : inlinePath
      )

      Editor.splitNodes(editor, { at, match: hasBlocks ? 'block' : 'inline' })

      const startRef = Editor.createPathRef(
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

        const end = Editor.getEnd(editor, path)
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
      const { selection } = editor.value
      let { at } = options

      if (!at && selection) {
        at = selection
      }

      if (Range.isRange(at)) {
        if (Range.isCollapsed(at)) {
          at = at.anchor
        } else {
          const pointRef = Editor.createPointRef(editor, Range.end(at))
          Editor.delete(editor, { at })
          at = pointRef.unref()!
        }
      }

      if (Point.isPoint(at) && !Editor.getMatch(editor, at.path, 'void')) {
        const { path, offset } = at
        editor.apply({ type: 'insert_text', path, offset, text })
      }
    })
  },

  /**
   * Remove a string of text in the editor.
   *
   * TODO!
   */

  removeText(
    editor: Editor,
    text: string,
    options: {
      at?: Range
    } = {}
  ) {
    Editor.withoutNormalizing(editor, () => {
      const { at = editor.value.selection } = options

      if (!at || Range.isCollapsed(at)) {
        return
      }

      const [start, end] = Range.edges(at)
      const texts = Editor.texts(editor, { at })
      const pathRefs = Array.from(texts, ([, p]) =>
        Editor.createPathRef(editor, p)
      )

      for (const [node, path] of Editor.texts(editor, { at }))
        if (Point.isPoint(at) && !Editor.getMatch(editor, at.path, 'void')) {
          const { path, offset } = at
          editor.apply({ type: 'insert_text', path, offset, text })
        }
    })
  },
}
