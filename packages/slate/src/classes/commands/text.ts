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
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const { reverse = false, unit = 'character', distance = 1 } = options
      let { at = this.value.selection } = options

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
        }
      }

      if (Path.isPath(at)) {
        this.removeNodes({ at })
        return
      }

      if (Range.isCollapsed(at)) {
        return
      }

      const [start, end] = Range.edges(at)
      const [ancestor, ancestorPath] = this.getAncestor(at)
      const depth = ancestorPath.length + 1
      const afterRef = this.createPointRef(end)
      const rangeRef = this.createRangeRef(at, { affinity: 'inward' })
      debugger
      this.splitNodes({ at: end, match: depth, always: true })
      this.splitNodes({ at: start, match: depth, always: true })
      const range = rangeRef.unref()!
      debugger
      this.removeNodes({ at: range, match: depth, hanging: true })

      debugger
      if (
        Value.isValue(ancestor) ||
        (Element.isElement(ancestor) && !this.isInline(ancestor))
      ) {
        this.mergeNodes({ at: afterRef.current!, hanging: true })
      }

      if (options.at == null) {
        this.select(afterRef.current!)
      }

      afterRef.unref()
    })
  }

  /**
   * Insert a fragment at a specific location in the editor.
   */

  insertFragment(
    this: Editor,
    fragment: Fragment,
    options: {
      at?: Range | Point
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
}

export default DeletingCommands
