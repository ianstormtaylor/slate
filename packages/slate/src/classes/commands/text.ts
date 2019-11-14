import { Editor, Element, Path, Location, Range, Point, Value } from '../..'
import { Node, NodeEntry, Descendant } from '../../interfaces/node'
import { Mark } from '../../interfaces/mark'
import { Text } from '../../interfaces/text'

class DeletingCommands {
  /**
   * Delete content in the editor.
   */

  delete(
    this: Editor,
    options: {
      at?: Location
      distance?: number
      unit?: 'character' | 'word' | 'line' | 'block'
      reverse?: boolean
      hanging?: boolean
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const { reverse = false, unit = 'character', distance = 1 } = options
      let { at = this.value.selection, hanging = false } = options

      if (!at) {
        return
      }

      if (Range.isRange(at) && Range.isCollapsed(at)) {
        at = at.anchor
      }

      if (Point.isPoint(at)) {
        const furthestVoid = this.getMatch(at.path, 'void')

        if (furthestVoid) {
          const [, voidPath] = furthestVoid
          at = voidPath
        } else {
          const opts = { unit, distance }
          const target = reverse
            ? this.getBefore(at, opts) || this.getStart([])
            : this.getAfter(at, opts) || this.getEnd([])
          at = { anchor: at, focus: target }
          hanging = true
        }
      }

      if (Path.isPath(at)) {
        this.removeNodes({ at })
        return
      }

      if (Range.isCollapsed(at)) {
        return
      }

      if (!hanging) {
        at = this.unhangRange(at)
      }

      let [start, end] = Range.edges(at)
      const [ancestor] = this.getAncestor(at)
      const isSingleText = Path.equals(start.path, end.path)
      const startVoid = this.getMatch(start.path, 'void')
      const endVoid = this.getMatch(end.path, 'void')

      // If the start or end points are inside an inline void, nudge them out.
      if (startVoid) {
        const block = this.getMatch(start.path, 'block')
        const before = this.getBefore(start)

        if (before && block && Path.isAncestor(block[1], before.path)) {
          start = before
        }
      }

      if (endVoid) {
        const block = this.getMatch(end.path, 'block')
        const after = this.getAfter(end)

        if (after && block && Path.isAncestor(block[1], after.path)) {
          end = after
        }
      }

      // Get the highest nodes that are completely inside the range, as well as
      // the start and end nodes.
      const matches = this.matches({
        at,
        match: ([n, p]) =>
          (Element.isElement(n) && this.isVoid(n)) ||
          (!Path.isCommon(p, start.path) && !Path.isCommon(p, end.path)),
      })

      const pathRefs = Array.from(matches, ([, p]) => this.createPathRef(p))
      const startRef = this.createPointRef(start)
      const endRef = this.createPointRef(end)

      if (!isSingleText && !startVoid) {
        const point = startRef.current!
        const [node] = this.getLeaf(point)
        const { path } = point
        const { offset } = start
        const text = node.text.slice(offset)
        this.apply({ type: 'remove_text', path, offset, text })
      }

      for (const pathRef of pathRefs) {
        const path = pathRef.unref()!
        this.removeNodes({ at: path })
      }

      if (!endVoid) {
        const point = endRef.current!
        const [node] = this.getLeaf(point)
        const { path } = point
        const offset = isSingleText ? start.offset : 0
        const text = node.text.slice(offset, end.offset)
        this.apply({ type: 'remove_text', path, offset, text })
      }

      const isBlockAncestor =
        Value.isValue(ancestor) ||
        (Element.isElement(ancestor) && !this.isInline(ancestor))

      if (
        !isSingleText &&
        isBlockAncestor &&
        endRef.current &&
        startRef.current
      ) {
        this.mergeNodes({ at: endRef.current, hanging: true })
      }

      const point = endRef.unref() || startRef.unref()

      if (options.at == null && point) {
        this.select(point)
      }
    })
  }

  /**
   * Insert a fragment at a specific location in the editor.
   */

  insertFragment(
    this: Editor,
    fragment: Node[],
    options: {
      at?: Location
      hanging?: boolean
    } = {}
  ) {
    this.withoutNormalizing(() => {
      let { at = this.value.selection } = options
      const { hanging = false } = options

      if (!fragment.length) {
        return
      }

      if (!at) {
        return
      } else if (Range.isRange(at)) {
        if (!hanging) {
          at = this.unhangRange(at)
        }

        if (Range.isCollapsed(at)) {
          at = at.anchor
        } else {
          const [, end] = Range.edges(at)
          const pointRef = this.createPointRef(end)
          this.delete({ at })
          at = pointRef.unref()!
        }
      } else if (Path.isPath(at)) {
        at = this.getStart(at)
      }

      if (this.getMatch(at.path, 'void')) {
        return
      }

      // If the insert point is at the edge of an inline node, move it outside
      // instead since it will need to be split otherwise.
      let inlineElementMatch = this.getMatch(at, 'inline-element')

      if (inlineElementMatch) {
        const [, inlinePath] = inlineElementMatch

        if (this.isEnd(at, inlinePath)) {
          const after = this.getAfter(inlinePath)!
          at = after
        } else if (this.isStart(at, inlinePath)) {
          const before = this.getBefore(inlinePath)!
          at = before
        }
      }

      const blockMatch = this.getMatch(at, 'block')!
      const [, blockPath] = blockMatch
      const isBlockStart = this.isStart(at, blockPath)
      const isBlockEnd = this.isEnd(at, blockPath)
      const mergeStart = !isBlockStart || (isBlockStart && isBlockEnd)
      const mergeEnd = !isBlockEnd
      const [, firstPath] = Node.first({ nodes: fragment }, [])
      const [, lastPath] = Node.last({ nodes: fragment }, [])

      // TODO: convert into a proper `Nodes.matches` iterable
      const matches: NodeEntry[] = []

      const matcher = ([n, p]: NodeEntry) => {
        if (
          mergeStart &&
          Path.isAncestor(p, firstPath) &&
          Element.isElement(n) &&
          !this.isVoid(n) &&
          !this.isInline(n)
        ) {
          return false
        }

        if (
          mergeEnd &&
          Path.isAncestor(p, lastPath) &&
          Element.isElement(n) &&
          !this.isVoid(n) &&
          !this.isInline(n)
        ) {
          return false
        }

        return true
      }

      for (const entry of Node.nodes({ nodes: fragment }, { pass: matcher })) {
        if (entry[1].length > 0 && matcher(entry)) {
          matches.push(entry)
        }
      }

      debugger
      const starts = []
      const middles = []
      const ends = []
      let starting = true
      let hasBlocks = false

      for (const [node] of matches) {
        if (Element.isElement(node) && !this.isInline(node)) {
          starting = false
          hasBlocks = true
          middles.push(node)
        } else if (starting) {
          starts.push(node)
        } else {
          ends.push(node)
        }
      }

      const inlineMatch = this.getMatch(at, 'inline')!
      const [, inlinePath] = inlineMatch
      const isInlineStart = this.isStart(at, inlinePath)
      const isInlineEnd = this.isEnd(at, inlinePath)
      debugger

      const middleRef = this.createPathRef(
        isBlockEnd ? Path.next(blockPath) : blockPath
      )

      const endRef = this.createPathRef(
        isInlineEnd ? Path.next(inlinePath) : inlinePath
      )

      this.splitNodes({ at, match: hasBlocks ? 'block' : 'inline' })
      debugger

      const startRef = this.createPathRef(
        !isInlineStart || (isInlineStart && isInlineEnd)
          ? Path.next(inlinePath)
          : inlinePath
      )

      this.insertNodes(starts, { at: startRef.current!, match: 'inline' })
      this.insertNodes(middles, { at: middleRef.current!, match: 'block' })
      this.insertNodes(ends, { at: endRef.current!, match: 'inline' })

      if (!options.at) {
        let path

        if (ends.length > 0) {
          path = Path.previous(endRef.current!)
        } else if (middles.length > 0) {
          path = Path.previous(middleRef.current!)
        } else {
          path = Path.previous(startRef.current!)
        }

        const end = this.getEnd(path)
        this.select(end)
      }

      startRef.unref()
      middleRef.unref()
      endRef.unref()
    })
  }

  /**
   * Insert a string of text in the editor.
   */

  insertText(
    this: Editor,
    text: string,
    options: {
      at?: Point | Range
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const { selection } = this.value
      let { at } = options

      if (!at && selection) {
        at = selection
      }

      if (Range.isRange(at)) {
        if (Range.isCollapsed(at)) {
          at = at.anchor
        } else {
          const pointRef = this.createPointRef(Range.end(at))
          this.delete({ at })
          at = pointRef.unref()!
        }
      }

      if (Point.isPoint(at) && !this.getMatch(at.path, 'void')) {
        const { path, offset } = at
        this.apply({ type: 'insert_text', path, offset, text })
      }
    })
  }

  /**
   * Remove a string of text in the editor.
   */

  removeText(
    this: Editor,
    text: string,
    options: {
      at?: Range
    } = {}
  ) {
    this.withoutNormalizing(() => {
      let { at = this.value.selection } = options

      if (!at || Range.isCollapsed(at)) {
        return
      }

      const [start, end] = Range.edges(at)
      const texts = this.texts({ at })
      const pathRefs = Array.from(texts, ([, p]) => this.createPathRef(p))

      for (const [node, path] of this.texts({ at }))
        if (Point.isPoint(at) && !this.getMatch(at.path, 'void')) {
          const { path, offset } = at
          this.apply({ type: 'insert_text', path, offset, text })
        }
    })
  }
}

export default DeletingCommands
