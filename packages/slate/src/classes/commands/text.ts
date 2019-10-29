import {
  Editor,
  Element,
  Node,
  PathRef,
  Fragment,
  Path,
  Location,
  Range,
  Point,
  Value,
  Text,
} from '../..'

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
            ? this.getBefore(at, opts) || this.getStart()
            : this.getAfter(at, opts) || this.getEnd()
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

      if (isBlockAncestor && endRef.current && startRef.current) {
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
    fragment: Fragment,
    options: {
      at?: Location
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const { selection } = this.value
      let { at } = options
      let isSelection = false

      if (!at && selection) {
        at = selection
        isSelection = true
      }

      if (Range.isRange(at) && Range.isCollapsed(at)) {
        at = at.anchor
      }

      if (Range.isRange(at)) {
        const [, end] = Range.edges(at)
        const pointRef = this.createPointRef(end)
        this.delete({ at })
        at = pointRef.unref()!
      }

      if (!Point.isPoint(at) || this.getMatch(at.path, 'void')) {
        return
      }

      const pointRef = this.createPointRef(at)
      this.splitNodes({ at, always: true })

      if (pointRef.current) {
        const [, insertPath] = this.getMatch(pointRef.current.path, 'block')!
        this.insertNodes(fragment.nodes, { at: insertPath })

        const afterClosest = this.getMatch(pointRef.current.path, 'block')
        const beforeClosest = this.getMatch(at.path, 'block')

        if (afterClosest && beforeClosest) {
          const [, afterPath] = afterClosest
          const [, beforePath] = beforeClosest
          const startPath = Path.next(beforePath)
          this.mergeNodes({ at: afterPath })
          this.mergeNodes({ at: startPath })
        }
      }

      if (isSelection) {
        this.select(pointRef.current!)
      }

      pointRef.unref()
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
