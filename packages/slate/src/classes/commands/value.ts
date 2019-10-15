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

// Properties that are restricted, and that can't be set directly on a `Value`.
const RESTRICTED_PROPERTIES = ['annotations', 'history', 'nodes', 'selection']

class ValueCommands {
  /**
   * Add a mark to the span of text that is currently selected.
   */

  addMark(this: Editor, mark: Mark): void {
    const { selection } = this.value

    if (selection == null) {
      return
    } else if (Range.isExpanded(selection)) {
      this.addMarkAtRange(selection, mark)
    } else {
      const activeMarks = this.getActiveMarks()

      if (!Mark.exists(mark, activeMarks)) {
        const marks = activeMarks.concat(mark)
        this.select({ marks })
      }
    }
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
      amount?: number
      unit?: 'offset' | 'character' | 'word' | 'line'
      reverse?: boolean
    } = {}
  ) {
    const { selection } = this.value

    if (selection == null) {
      return
    }

    const [start] = Range.points(selection)
    const pointRef = this.createPointRef(start)
    this.deleteAtRange(selection, options)
    this.moveTo(pointRef.current!)
    pointRef.unref()
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

  insertBlock(this: Editor, block: Element) {
    const { selection } = this.value

    if (selection == null) {
      return
    }

    const [start] = Range.points(selection)
    const pointRef = this.createPointRef(start)
    this.insertBlockAtRange(selection, block)
    this.moveTo(pointRef.current!)
    pointRef.unref()
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
    this.moveTo(pointRef.current!)
    pointRef.unref()
  }

  /**
   * Insert an inline node at the cursor.
   */

  insertInline(this: Editor, inline: Element) {
    const { selection } = this.value

    if (selection == null) {
      return
    }

    const [start] = Range.points(selection)
    const pointRef = this.createPointRef(start)
    this.insertInlineAtRange(selection, inline)
    this.moveTo(pointRef.current!)
    pointRef.unref()
  }

  /**
   * Insert a string of text at the current selection.
   */

  insertText(this: Editor, text: string) {
    const { selection } = this.value

    if (selection == null) {
      return
    }

    const [start] = Range.points(selection)
    const pointRef = this.createPointRef(start)
    this.insertTextAtRange(selection, text)
    this.moveTo(pointRef.current!)
    pointRef.unref()
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

  /**
   * Remove a mark from all of the spans of text in the current selection.
   */

  removeMark(this: Editor, mark: Mark): void {
    const { value } = this
    const { selection } = value

    if (selection == null) {
      return
    } else if (Range.isExpanded(selection)) {
      this.removeMarkAtRange(selection, mark)
    } else {
      const activeMarks = this.getActiveMarks()

      if (Mark.exists(mark, activeMarks)) {
        const marks = activeMarks.filter(m => !Mark.matches(m, mark))
        this.select({ marks })
      }
    }
  }

  /**
   * Replace a mark on all of the spans of text in the selection with a new one.
   */

  replaceMark(this: Editor, oldMark: Mark, newMark: Mark): void {
    this.withoutNormalizing(() => {
      this.removeMark(oldMark)
      this.addMark(newMark)
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

  setValue(this: Editor, props: {}) {
    const { value } = this
    const newProps = {}
    const oldProps = {}
    let isChange = false

    // Dedupe new and old properties to avoid unnecessary sets.
    for (const k in props) {
      if (RESTRICTED_PROPERTIES.includes(k)) {
        throw new Error(
          `Cannot set the restricted property "${k}" on a value. You must use one of the purpose-built editor methods instead.`
        )
      }

      if (props[k] !== value[k]) {
        isChange = true
        newProps[k] = props[k]
        oldProps[k] = value[k]
      }
    }

    // PERF: If no properties have changed don't apply an operation at all.
    if (!isChange) {
      return
    }

    this.apply({
      type: 'set_value',
      properties: oldProps,
      newProperties: newProps,
    })
  }

  /**
   * Split the block at the cursor, up to a height.
   */

  splitBlock(
    this: Editor,
    options: {
      always?: boolean
      height?: number
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const { selection } = this.value

      if (selection == null) {
        return
      }

      const [, end] = Range.points(selection)
      const pointRef = this.createPointRef(end)
      this.splitBlockAtRange(selection, options)
      this.moveTo(pointRef.current!)
      pointRef.unref()
    })
  }

  /**
   * Split the inline at the cursor, up to a height.
   */

  splitInline(
    this: Editor,
    options: {
      always?: boolean
      height?: number
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const { selection } = this.value

      if (selection == null) {
        return
      }

      const [, end] = Range.points(selection)
      const pointRef = this.createPointRef(end)
      this.splitInlineAtRange(selection, options)
      this.moveTo(pointRef.current!)
      pointRef.unref()
    })
  }

  /**
   * Toggle a mark on or off for all the spans of text in the selection.
   */

  toggleMark(this: Editor, mark: Mark): void {
    const activeMarks = this.getActiveMarks()

    if (Mark.exists(mark, activeMarks)) {
      this.removeMark(mark)
    } else {
      this.addMark(mark)
    }
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
    this.select(rangeRef.current)
    rangeRef.unref()
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
    this.select(rangeRef.current)
    rangeRef.unref()
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
    this.select(rangeRef.current)
    rangeRef.unref()
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
    this.select(rangeRef.current)
    rangeRef.unref()
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
