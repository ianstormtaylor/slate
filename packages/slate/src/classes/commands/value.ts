import {
  Change,
  Operation,
  Editor,
  Element,
  Node,
  Path,
  Text,
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

  flush(this: Editor): void {
    this[FLUSHING] = false
    const { value, operations } = this

    if (operations.length !== 0) {
      const change: Change = { value, operations }
      this.operations = []
      this.onChange(change)
    }
  }

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
        this.normalizeNodes({ at: path! })
        m++
      }
    })
  }

  withoutNormalizing(this: Editor, fn: () => void): void {
    const value = this[NORMALIZING]
    this[NORMALIZING] = false
    fn()
    this[NORMALIZING] = value
    this.normalize()
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
