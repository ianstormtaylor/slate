import { Operation, Editor, Node, Path, Text, Value } from '../..'
import {
  DIRTY_PATHS,
  PATH_REFS,
  POINT_REFS,
  RANGE_REFS,
  FLUSHING,
  NORMALIZING,
} from '../../utils/state'

class GeneralCommands {
  apply(this: Editor, op: Operation): void {
    this.value = Value.transform(this.value, op)
    this.operations.push(op)

    for (const ref of PATH_REFS.get(this)!) {
      ref.transform(op)
    }

    for (const ref of POINT_REFS.get(this)!) {
      ref.transform(op)
    }

    for (const ref of RANGE_REFS.get(this)!) {
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

    for (const path of DIRTY_PATHS.get(this)!) {
      add(Path.transform(path, op))
    }

    for (const path of getDirtyPaths(op)) {
      add(path)
    }

    DIRTY_PATHS.set(this, dirtyPaths)
    this.normalize()

    if (!FLUSHING.get(this)) {
      FLUSHING.set(this, true)
      Promise.resolve().then(() => this.flush())
    }
  }

  flush(this: Editor): void {
    FLUSHING.set(this, false)
    const { value, operations } = this

    if (operations.length !== 0) {
      this.operations = []
      this.onChange(value, operations)
    }
  }

  normalize(
    this: Editor,
    options: {
      force?: boolean
    } = {}
  ): void {
    const { force = false } = options

    if (!NORMALIZING.get(this)) {
      return
    }

    if (force) {
      const allPaths = Array.from(Node.nodes(this.value), ([, p]) => p)
      DIRTY_PATHS.set(this, allPaths)
    }

    if (DIRTY_PATHS.get(this)!.length === 0) {
      return
    }

    this.withoutNormalizing(() => {
      const max = DIRTY_PATHS.get(this)!.length * 42 // HACK: better way to do this?
      let m = 0

      while (DIRTY_PATHS.get(this)!.length !== 0) {
        if (m > max) {
          throw new Error(`
            Could not completely normalize the value after ${max} iterations! This is usually due to incorrect normalization logic that leaves a node in an invalid state.
          `)
        }

        const path = DIRTY_PATHS.get(this)!.pop()
        this.normalizeNodes({ at: path! })
        m++
      }
    })
  }

  withoutNormalizing(this: Editor, fn: () => void): void {
    const value = NORMALIZING.get(this)!
    NORMALIZING.set(this, false)
    fn()
    NORMALIZING.set(this, value)
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
        : Array.from(Node.nodes(node), ([, p]) => path.concat(p))

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

export default GeneralCommands
