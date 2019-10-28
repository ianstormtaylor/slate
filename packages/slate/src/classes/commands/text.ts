import {
  Editor,
  Element,
  Node,
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
      const { selection } = this.value
      const { reverse = false, unit = 'character', distance = 1 } = options
      let { at } = options
      let isSelection = false
      let ancestorPath: Path = []
      let ancestor: Node = this.value

      if (!at && selection) {
        at = selection
        isSelection = true
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
            ? this.getBefore(at, opts)
            : this.getAfter(at, opts)

          if (target) {
            at = { anchor: at, focus: target }
          }
        }
      }

      if (Range.isRange(at)) {
        const [start, end] = Range.edges(at)
        const [, ancestorPath] = this.getAncestor(at)
        const d = Range.isCollapsed(at) ? 'text' : ancestorPath.length
        const rangeRef = this.createRangeRef(at, { affinity: 'inward' })
        this.splitNodes({ at: end, match: d, always: true })
        this.splitNodes({ at: start, match: d, always: true })
        at = rangeRef.unref()!
      }

      if (Path.isPath(at)) {
        const node = Node.get(this.value, at)
        this.apply({ type: 'remove_node', path: at, node })
      }

      if (Range.isRange(at)) {
        const [start, end] = Range.edges(at)
        const after = this.getAfter(end)!
        const afterRef = this.createPointRef(after)
        const l = ancestorPath.length
        const startIndex = start.path[l]
        const endIndex = end.path[l]
        const hasBlocks =
          Value.isValue(ancestor) ||
          (Element.isElement(ancestor) && this.hasBlocks(ancestor))

        // Iterate backwards so the paths are unaffected.
        for (let i = endIndex; i >= startIndex; i--) {
          const path = ancestorPath.concat(i)
          const node = Node.get(this.value, path)
          this.apply({ type: 'remove_node', path, node })
        }

        if (hasBlocks) {
          this.mergeNodes({ at: afterRef.current!.path })
        }

        if (isSelection) {
          this.select(afterRef.current!)
        }

        afterRef.unref()
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
