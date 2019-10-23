import {
  Change,
  Editor,
  Element,
  Fragment,
  Mark,
  Node,
  Operation,
  Path,
  Text,
  Range,
  Point,
  Value,
} from '../..'
import {
  DIRTY_PATHS,
  PATH_REFS,
  POINT_REFS,
  RANGE_REFS,
  FLUSHING,
  NORMALIZING,
} from '../../symbols'

class ValueCommands {
  /**
   * Add a set of marks at a location. You can add them to the content of
   * specific node at a path, or to all of the text content in a range.
   */

  addMarks(
    this: Editor,
    marks: Mark[],
    options: {
      at?: Path | Range
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

      if (Path.isPath(at)) {
        at = this.getRange(at)
      }

      if (!Range.isRange(at)) {
        return
      }

      // Split the text nodes at the range's edges if necessary.
      const rangeRef = this.createRangeRef(at, { stick: 'inward' })
      const [start, end] = Range.points(at)
      this.splitNodeAtPoint(end, { always: false })
      this.splitNodeAtPoint(start, { always: false })
      at = rangeRef.unref()!

      // De-dupe the marks being added to ensure the set is unique.
      const set: Mark[] = []

      for (const mark of marks) {
        if (!Mark.exists(mark, set)) {
          set.push(mark)
        }
      }

      for (const [node, path] of this.texts({ at })) {
        for (const mark of set) {
          if (!Mark.exists(mark, node.marks)) {
            this.apply({ type: 'add_mark', path, mark })
          }
        }
      }

      if (isSelection) {
        this.select(at)
      }
    })
  }

  /**
   * Apply an operation to the editor, updating its current value.
   */

  apply(this: Editor, op: Operation): void {
    this.value = Value.transform(this.value, op)
    this.operations.push(op)

    for (const ref of Object.values(this[PATH_REFS])) {
      ref.transform(op)
    }

    for (const ref of Object.values(this[POINT_REFS])) {
      ref.transform(op)
    }

    for (const ref of Object.values(this[RANGE_REFS])) {
      ref.transform(op)
    }

    const pathCache = {}
    const dirtyPaths: Path[] = []
    const add = (path: Path | null) => {
      if (path == null) {
        return
      }

      const key = path.join(',')

      if (key in pathCache) {
        return
      }

      pathCache[key] = true
      dirtyPaths.push(path)
    }

    for (const path of this[DIRTY_PATHS]) {
      add(Path.transform(path, op))
    }

    for (const path of getDirtyPaths(op)) {
      add(path)
    }

    this[DIRTY_PATHS] = dirtyPaths
    this.normalize()

    if (!this[FLUSHING]) {
      this[FLUSHING] = true
      Promise.resolve().then(() => this.flush())
    }
  }

  /**
   * Delete the content in the selection, or starting from the cursor.
   */

  delete(
    this: Editor,
    options: {
      at?: Path | Point | Range
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
        const furthestVoid = this.getFurthestVoid(at.path)

        if (furthestVoid) {
          const [, voidPath] = furthestVoid
          at = voidPath
        } else {
          const opts = { unit, distance }
          const target = reverse
            ? this.getPreviousPoint(at, opts)
            : this.getNextPoint(at, opts)

          if (target) {
            at = { anchor: at, focus: target }
          }
        }
      }

      if (Range.isRange(at)) {
        const [start, end] = Range.points(at)
        const rangeRef = this.createRangeRef(at, { stick: 'inward' })
        const [common, commonPath] = this.getCommon(start.path, end.path)
        let startHeight = start.path.length - commonPath.length - 1
        let endHeight = end.path.length - commonPath.length - 1

        if (Path.equals(start.path, end.path)) {
          ancestorPath = Path.parent(commonPath)
          ancestor = Node.get(this.value, ancestorPath)
          startHeight = 0
          endHeight = 0
        } else {
          ancestorPath = commonPath
          ancestor = common
        }

        this.splitNodeAtPoint(end, { height: Math.max(0, endHeight) })
        this.splitNodeAtPoint(start, { height: Math.max(0, startHeight) })
        at = rangeRef.unref()!
      }

      if (Path.isPath(at)) {
        const node = Node.get(this.value, at)
        this.apply({ type: 'remove_node', path: at, node })
      }

      if (Range.isRange(at)) {
        const [start, end] = Range.points(at)
        const after = this.getNextPoint(end)!
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
          this.mergeBlockAtPath(afterRef.current!.path)
        }

        if (isSelection) {
          this.select(afterRef.current!)
        }

        afterRef.unref()
      }
    })
  }

  /**
   * Flush the editor's current changes.
   */

  flush(this: Editor): void {
    this[FLUSHING] = false
    const { value, operations } = this

    if (operations.length !== 0) {
      const change: Change = { value, operations }
      this.operations = []
      this.onChange(change)
    }
  }

  /**
   * Insert a block node at the cursor.
   */

  insertBlock(
    this: Editor,
    block: Element,
    options: {
      at?: Path | Point | Range
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const { selection } = this.value
      let { at } = options
      let isSelection = false
      let isAtEnd = false

      if (!at && selection) {
        at = selection
        isSelection = true
      }

      if (Range.isRange(at) && Range.isCollapsed(at)) {
        at = at.anchor
      }

      if (Range.isRange(at)) {
        const [, end] = Range.points(at)
        const pointRef = this.createPointRef(end)
        this.delete({ at })
        at = pointRef.unref()!
      }

      if (Point.isPoint(at)) {
        const [, blockPath] = this.getClosestBlock(at.path)!
        isAtEnd = this.isAtEnd(at, blockPath)
        const pointRef = this.createPointRef(at)
        this.splitBlockAtPoint(at, { always: false })
        const point = pointRef.unref()!
        at = point.path
      }

      if (!Path.isPath(at)) {
        return
      }

      const [, blockPath] = this.getClosestBlock(at)!
      const path = isAtEnd ? Path.next(blockPath) : blockPath
      this.insertNodeAtPath(path, block)

      if (isSelection) {
        const point = this.getEnd(path)

        if (point) {
          this.select(point)
        }
      }
    })
  }

  /**
   * Insert a fragment of nodes at the cursor.
   */

  insertFragment(this: Editor, fragment: Fragment) {
    const { selection } = this.value

    if (selection == null) {
      return
    }

    const [start] = Range.points(selection)
    const pointRef = this.createPointRef(start)
    this.insertFragmentAtRange(selection, fragment)
    this.select(pointRef.current!)
    pointRef.unref()
  }

  /**
   * Insert an inline node at the cursor.
   */

  insertInline(
    this: Editor,
    inline: Element,
    options: {
      at?: Path | Point | Range
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const { selection } = this.value
      let { at } = options
      let isSelection = false
      let isAtEnd = false

      if (!at && selection) {
        at = selection
        isSelection = true
      }

      if (Range.isRange(at) && Range.isCollapsed(at)) {
        at = at.anchor
      }

      if (Range.isRange(at)) {
        const [, end] = Range.points(at)
        const pointRef = this.createPointRef(end)
        this.delete({ at })
        at = pointRef.unref()!
      }

      if (Point.isPoint(at)) {
        isAtEnd = this.isAtEnd(at, at.path)
        const pointRef = this.createPointRef(at)
        this.splitNodeAtPoint(at, { always: false })
        const point = pointRef.unref()!
        at = point.path
      }

      if (!Path.isPath(at)) {
        return
      }

      const [, blockPath] = this.getClosestBlock(at)!

      if (this.getFurthestVoid(blockPath)) {
        return
      }

      const path = isAtEnd ? Path.next(at) : at
      this.insertNodeAtPath(path, inline)

      if (isSelection) {
        const point = this.getEnd(path)

        if (point) {
          this.select(point)
        }
      }
    })
  }

  /**
   * Insert a string of text at the current selection.
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

      if (Range.isRange(at) && Range.isCollapsed(at)) {
        at = at.anchor
      }

      if (Range.isRange(at)) {
        const [, end] = Range.points(at)
        const pointRef = this.createPointRef(end)
        this.delete({ at })
        at = pointRef.unref()!
      }

      if (Point.isPoint(at) && !this.getFurthestVoid(at.path)) {
        for (const [annotation, key] of this.annotations({ at })) {
          if (this.isAtomic(annotation)) {
            this.removeAnnotation(key)
          }
        }

        const { path, offset } = at
        this.apply({ type: 'insert_text', path, offset, text })
      }
    })
  }

  /**
   * Normalize any paths that are considered "dirty", meaning they have recently
   * been changed by an operation.
   */

  normalize(
    this: Editor,
    options: {
      force?: boolean
    } = {}
  ): void {
    const { force = false } = options

    if (!this[NORMALIZING]) {
      return
    }

    if (force) {
      const allPaths = Array.from(Node.entries(this.value), ([, p]) => p)
      this[DIRTY_PATHS] = allPaths
    }

    if (this[DIRTY_PATHS].length === 0) {
      return
    }

    this.withoutNormalizing(() => {
      const max = this[DIRTY_PATHS].length * 42 // HACK: better way to do this?
      let m = 0

      while (this[DIRTY_PATHS].length !== 0) {
        if (m > max) {
          throw new Error(`
            Could not completely normalize the value after ${max} iterations! This is usually due to incorrect normalization logic that leaves a node in an invalid state.
          `)
        }

        const path = this[DIRTY_PATHS].pop()
        this.normalizeNodeAtPath(path!)
        m++
      }
    })
  }

  removeMarks(
    this: Editor,
    marks: Mark[],
    options: {
      at?: Path | Range
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

      if (Path.isPath(at)) {
        at = this.getRange(at)
      }

      if (Range.isRange(at)) {
        const rangeRef = this.createRangeRef(at, { stick: 'inward' })
        const [start, end] = Range.points(at)
        this.splitNodeAtPoint(end, { always: false })
        this.splitNodeAtPoint(start, { always: false })
        at = rangeRef.unref()!

        for (const [mark, i, node, path] of this.marks({ at })) {
          if (Mark.exists(mark, marks)) {
            this.apply({ type: 'remove_mark', path, mark })
          }
        }

        if (isSelection) {
          this.select(at)
        }
      }
    })
  }

  /**
   * Set new properties on the leaf block nodes in the current selection.
   */

  setLeafBlocks(this: Editor, props: {}) {
    const { selection } = this.value

    if (selection == null) {
      return
    }

    this.setLeafBlocksAtRange(selection, props)
  }

  /**
   * Set new properties on the leaf inline nodes in the current selection.
   */

  setLeafInlines(this: Editor, props: {}) {
    const { selection } = this.value

    if (selection == null) {
      return
    }

    this.setLeafInlinesAtRange(selection, props)
  }

  /**
   * Set new properties on the root block nodes in the current selection.
   */

  setRootBlocks(this: Editor, props: {}) {
    const { selection } = this.value

    if (selection == null) {
      return
    }

    this.setRootBlocksAtRange(selection, props)
  }

  /**
   * Set new properties on the root inline nodes in the current selection.
   */

  setRootInlines(this: Editor, props: {}) {
    const { selection } = this.value

    if (selection == null) {
      return
    }

    this.setRootInlinesAtRange(selection, props)
  }

  /**
   * Set new properties on the top-level `Value` object.
   */

  setValue(this: Editor, props: Partial<Value>) {
    const { value } = this
    const newProps = {}
    const oldProps = {}

    // Dedupe new and old properties to avoid unnecessary sets.
    for (const k in props) {
      if (k === 'annotations' || k === 'nodes' || k === 'selection') {
        continue
      }

      if (props[k] !== value[k]) {
        newProps[k] = props[k]
        oldProps[k] = value[k]
      }
    }

    // PERF: If no properties have changed don't apply an operation at all.
    if (Object.keys(newProps).length === 0) {
      return
    }

    this.apply({
      type: 'set_value',
      properties: oldProps,
      newProperties: newProps,
    })
  }

  /**
   * Set new properties on a set of marks.
   */

  setMarks(
    this: Editor,
    marks: Mark[],
    props: Partial<Mark>,
    options: {
      at?: Path | Range
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

      // PERF: Do this before the path coercion logic since we're guaranteed not
      // to need to split in that case.
      if (Range.isRange(at)) {
        // Split the text nodes at the range's edges if necessary.
        const rangeRef = this.createRangeRef(at, { stick: 'inward' })
        const [start, end] = Range.points(at)
        this.splitNodeAtPoint(end, { always: false })
        this.splitNodeAtPoint(start, { always: false })
        at = rangeRef.unref()!
      }

      if (Path.isPath(at)) {
        at = this.getRange(at)
      }

      if (Range.isRange(at)) {
        for (const [mark, i, node, path] of this.marks({ at })) {
          if (!Mark.exists(mark, marks)) {
            continue
          }

          const newProps = {}

          for (const k in props) {
            if (props[k] !== mark[k]) {
              newProps[k] = props[k]
            }
          }

          // If no properties have changed don't apply an operation at all.
          if (Object.keys(newProps).length === 0) {
            continue
          }

          this.apply({
            type: 'set_mark',
            path,
            properties: mark,
            newProperties: newProps,
          })
        }

        if (isSelection) {
          this.select(at)
        }
      }
    })
  }

  /**
   * Split the block at the cursor, up to a height.
   */

  splitBlock(
    this: Editor,
    options: {
      at?: Point | Range
      always?: boolean
      height?: number
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const { selection } = this.value
      const { height = 0, always = true } = options
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
        const [, end] = Range.points(at)
        const pointRef = this.createPointRef(end)
        this.delete({ at })
        at = pointRef.unref()!
      }

      if (!Point.isPoint(at)) {
        return
      }

      const { path } = at
      const closestBlock = this.getClosestBlock(path)
      let totalHeight: number

      if (closestBlock) {
        const [, blockPath] = closestBlock
        const relPath = Path.relative(path, blockPath)
        totalHeight = relPath.length + height
      } else {
        totalHeight = path.length
      }

      const pointRef = this.createPointRef(at)
      this.splitNodeAtPoint(at, { height: totalHeight, always })

      if (isSelection) {
        const point = pointRef.current!
        this.select(point)
      }

      pointRef.unref()
    })
  }

  /**
   * Split the inline at the cursor, up to a height.
   */

  splitInline(
    this: Editor,
    options: {
      at?: Point | Range
      always?: boolean
      height?: number
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const { selection } = this.value
      const { height = 0, always = true } = options
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
        const [, end] = Range.points(at)
        const pointRef = this.createPointRef(end)
        this.delete({ at })
        at = pointRef.unref()!
      }

      if (!Point.isPoint(at)) {
        return
      }

      const { path } = at
      const furthestInline = this.getFurthestInline(path)
      let totalHeight: number

      if (furthestInline) {
        const [, furthestPath] = furthestInline
        const furthestRelPath = Path.relative(path, furthestPath)
        // Ensure that the height isn't higher than the furthest inline, since
        // this command should never split any block nodes.
        const h = Math.max(furthestRelPath.length, height)
        totalHeight = h
      } else {
        // If there are no inline ancestors, just split the text node.
        totalHeight = 0
      }

      const pointRef = this.createPointRef(at)
      this.splitNodeAtPoint(at, { height: totalHeight, always })

      if (isSelection) {
        const point = pointRef.current!
        this.select(point)
      }

      pointRef.unref()
    })
  }

  /**
   * Toggle a mark on or off for all the spans of text in the selection.
   */

  toggleMarks(
    this: Editor,
    marks: Mark[],
    options: {
      at?: Path | Range
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const { at } = options
      const existing = this.getActiveMarks({ at })
      const exists = marks.every(m => Mark.exists(m, existing))

      if (exists) {
        this.removeMarks(marks, { at })
      } else {
        this.addMarks(marks, { at })
      }
    })
  }

  /**
   * Unwrap the block nodes in the selection that match a set of properties.
   */

  unwrapBlock(this: Editor, props: {}): void {
    const { selection } = this.value

    if (selection == null) {
      return
    }

    const rangeRef = this.createRangeRef(selection)
    this.unwrapBlockAtRange(selection, props)
    const range = rangeRef.unref()!
    this.select(range)
  }

  /**
   * Unwrap the inline nodes in the selection that match a set of properties.
   */

  unwrapInline(this: Editor, props: {}): void {
    const { selection } = this.value

    if (selection == null) {
      return
    }

    const rangeRef = this.createRangeRef(selection)
    this.unwrapInlineAtRange(selection, props)
    const range = rangeRef.unref()!
    this.select(range)
  }

  /**
   * Apply a series of changes inside a synchronous callback, deferring
   * normalization until after the callback has finished executing.
   */

  withoutNormalizing(this: Editor, fn: () => void): void {
    const value = this[NORMALIZING]
    this[NORMALIZING] = false
    fn()
    this[NORMALIZING] = value
    this.normalize()
  }

  /**
   * Wrap the block nodes in the selection in a new block.
   */

  wrapBlock(this: Editor, block: Element): void {
    const { selection } = this.value

    if (selection == null) {
      return
    }

    const rangeRef = this.createRangeRef(selection)
    this.wrapBlockAtRange(selection, block)
    const range = rangeRef.unref()!
    this.select(range)
  }

  /**
   * Wrap the inline nodes in the selection in a new inline.
   */

  wrapInline(this: Editor, inline: Element): void {
    const { selection } = this.value

    if (selection == null) {
      return
    }

    const rangeRef = this.createRangeRef(selection)
    this.wrapInlineAtRange(selection, inline)
    const range = rangeRef.unref()!
    this.select(range)
  }
}

/**
 * Get the "dirty" paths generated from an operation.
 */

const getDirtyPaths = (op: Operation) => {
  switch (op.type) {
    case 'add_mark':
    case 'insert_text':
    case 'remove_mark':
    case 'remove_text':
    case 'set_mark':
    case 'set_node': {
      const { path } = op
      return Path.levels(path)
    }

    case 'insert_node': {
      const { node, path } = op
      const levels = Path.levels(path)
      const descendants = Text.isText(node)
        ? []
        : Array.from(Node.entries(node), ([, p]) => path.concat(p))

      return [...levels, ...descendants]
    }

    case 'merge_node': {
      const { path } = op
      const ancestors = Path.ancestors(path)
      const previousPath = Path.previous(path)
      return [...ancestors, previousPath]
    }

    case 'move_node': {
      const { path, newPath } = op

      if (Path.equals(path, newPath)) {
        return []
      }

      const oldAncestors: Path[] = []
      const newAncestors: Path[] = []

      for (const ancestor of Path.ancestors(path)) {
        const path = Path.transform(ancestor, op)
        oldAncestors.push(path!)
      }

      for (const ancestor of Path.ancestors(newPath)) {
        const path = Path.transform(ancestor, op)
        newAncestors.push(path!)
      }

      return [...oldAncestors, ...newAncestors]
    }

    case 'remove_node': {
      const { path } = op
      const ancestors = Path.ancestors(path)
      return [...ancestors]
    }

    case 'split_node': {
      const { path } = op
      const levels = Path.levels(path)
      const nextPath = Path.next(path)
      return [...levels, nextPath]
    }

    default: {
      return []
    }
  }
}

export default ValueCommands
