import {
  InsertNodeOperation,
  MergeNodeOperation,
  MoveNodeOperation,
  Operation,
  RemoveNodeOperation,
  SplitNodeOperation,
} from '..'
import { TextDirection } from '../types/types'

/**
 * `Path` arrays are a list of indexes that describe a node's exact position in
 * a Slate node tree. Although they are usually relative to the root `Editor`
 * object, they can be relative to any `Node` object.
 */

export type Path = number[]

export interface PathAncestorsOptions {
  reverse?: boolean
}

export interface PathLevelsOptions {
  reverse?: boolean
}

export interface PathTransformOptions {
  affinity?: TextDirection | null
}

export interface PathInterface {
  /**
   * Get a list of ancestor paths for a given path.
   *
   * The paths are sorted from shallowest to deepest ancestor. However, if the
   * `reverse: true` option is passed, they are reversed.
   */
  ancestors: (path: Path, options?: PathAncestorsOptions) => Path[]

  /**
   * Get the common ancestor path of two paths.
   */
  common: (path: Path, another: Path) => Path

  /**
   * Compare a path to another, returning an integer indicating whether the path
   * was before, at, or after the other.
   *
   * Note: Two paths of unequal length can still receive a `0` result if one is
   * directly above or below the other. If you want exact matching, use
   * [[Path.equals]] instead.
   */
  compare: (path: Path, another: Path) => -1 | 0 | 1

  /**
   * Check if a path ends after one of the indexes in another.
   */
  endsAfter: (path: Path, another: Path) => boolean

  /**
   * Check if a path ends at one of the indexes in another.
   */
  endsAt: (path: Path, another: Path) => boolean

  /**
   * Check if a path ends before one of the indexes in another.
   */
  endsBefore: (path: Path, another: Path) => boolean

  /**
   * Check if a path is exactly equal to another.
   */
  equals: (path: Path, another: Path) => boolean

  /**
   * Check if the path of previous sibling node exists
   */
  hasPrevious: (path: Path) => boolean

  /**
   * Check if a path is after another.
   */
  isAfter: (path: Path, another: Path) => boolean

  /**
   * Check if a path is an ancestor of another.
   */
  isAncestor: (path: Path, another: Path) => boolean

  /**
   * Check if a path is before another.
   */
  isBefore: (path: Path, another: Path) => boolean

  /**
   * Check if a path is a child of another.
   */
  isChild: (path: Path, another: Path) => boolean

  /**
   * Check if a path is equal to or an ancestor of another.
   */
  isCommon: (path: Path, another: Path) => boolean

  /**
   * Check if a path is a descendant of another.
   */
  isDescendant: (path: Path, another: Path) => boolean

  /**
   * Check if a path is the parent of another.
   */
  isParent: (path: Path, another: Path) => boolean

  /**
   * Check is a value implements the `Path` interface.
   */
  isPath: (value: any) => value is Path

  /**
   * Check if a path is a sibling of another.
   */
  isSibling: (path: Path, another: Path) => boolean

  /**
   * Get a list of paths at every level down to a path. Note: this is the same
   * as `Path.ancestors`, but including the path itself.
   *
   * The paths are sorted from shallowest to deepest. However, if the `reverse:
   * true` option is passed, they are reversed.
   */
  levels: (path: Path, options?: PathLevelsOptions) => Path[]

  /**
   * Given a path, get the path to the next sibling node.
   */
  next: (path: Path) => Path | undefined

  /**
   * Returns whether this operation can affect paths or not. Used as an
   * optimization when updating dirty paths during normalization
   *
   * NOTE: This *must* be kept in sync with the implementation of 'transform'
   * below
   */
  operationCanTransformPath: (
    operation: Operation
  ) => operation is
    | InsertNodeOperation
    | RemoveNodeOperation
    | MergeNodeOperation
    | SplitNodeOperation
    | MoveNodeOperation

  /**
   * Given a path, return a new path referring to the parent node above it.
   */
  parent: (path: Path) => Path | undefined

  /**
   * Given a path, get the path to the previous sibling node.
   */
  previous: (path: Path) => Path | undefined

  /**
   * Get a path relative to an ancestor.
   */
  relative: (path: Path, ancestor: Path) => Path | undefined

  /**
   * Transform a path by an operation.
   */
  transform: (
    path: Path,
    operation: Operation,
    options?: PathTransformOptions
  ) => Path | null
}

// eslint-disable-next-line no-redeclare
export const Path: PathInterface = {
  ancestors(path: Path, options: PathAncestorsOptions = {}): Path[] {
    const { reverse = false } = options
    let paths = Path.levels(path, options)

    if (reverse) {
      paths = paths.slice(1)
    } else {
      paths = paths.slice(0, -1)
    }

    return paths
  },

  common(path: Path, another: Path): Path {
    const common: Path = []

    for (let i = 0; i < path.length && i < another.length; i++) {
      const av = path[i]
      const bv = another[i]

      if (av !== bv) {
        break
      }

      common.push(av)
    }

    return common
  },

  compare(path: Path, another: Path): -1 | 0 | 1 {
    const min = Math.min(path.length, another.length)

    for (let i = 0; i < min; i++) {
      if (path[i] < another[i]) return -1
      if (path[i] > another[i]) return 1
    }

    return 0
  },

  endsAfter(path: Path, another: Path): boolean {
    const i = path.length - 1
    const as = path.slice(0, i)
    const bs = another.slice(0, i)
    const av = path[i]
    const bv = another[i]
    return Path.equals(as, bs) && av > bv
  },

  endsAt(path: Path, another: Path): boolean {
    const i = path.length
    const as = path.slice(0, i)
    const bs = another.slice(0, i)
    return Path.equals(as, bs)
  },

  endsBefore(path: Path, another: Path): boolean {
    const i = path.length - 1
    const as = path.slice(0, i)
    const bs = another.slice(0, i)
    const av = path[i]
    const bv = another[i]
    return Path.equals(as, bs) && av < bv
  },

  equals(path: Path, another: Path): boolean {
    return (
      path.length === another.length && path.every((n, i) => n === another[i])
    )
  },

  hasPrevious(path: Path): boolean {
    return path[path.length - 1] > 0
  },

  isAfter(path: Path, another: Path): boolean {
    return Path.compare(path, another) === 1
  },

  isAncestor(path: Path, another: Path): boolean {
    return path.length < another.length && Path.compare(path, another) === 0
  },

  isBefore(path: Path, another: Path): boolean {
    return Path.compare(path, another) === -1
  },

  isChild(path: Path, another: Path): boolean {
    return (
      path.length === another.length + 1 && Path.compare(path, another) === 0
    )
  },

  isCommon(path: Path, another: Path): boolean {
    return path.length <= another.length && Path.compare(path, another) === 0
  },

  isDescendant(path: Path, another: Path): boolean {
    return path.length > another.length && Path.compare(path, another) === 0
  },

  isParent(path: Path, another: Path): boolean {
    return (
      path.length + 1 === another.length && Path.compare(path, another) === 0
    )
  },

  isPath(value: any): value is Path {
    return (
      Array.isArray(value) &&
      (value.length === 0 || typeof value[0] === 'number')
    )
  },

  isSibling(path: Path, another: Path): boolean {
    if (path.length !== another.length) {
      return false
    }

    const as = path.slice(0, -1)
    const bs = another.slice(0, -1)
    const al = path[path.length - 1]
    const bl = another[another.length - 1]
    return al !== bl && Path.equals(as, bs)
  },

  levels(path: Path, options: PathLevelsOptions = {}): Path[] {
    const { reverse = false } = options
    const list: Path[] = []

    for (let i = 0; i <= path.length; i++) {
      list.push(path.slice(0, i))
    }

    if (reverse) {
      list.reverse()
    }

    return list
  },

  next(path: Path): Path | undefined {
    if (path.length === 0) {
      return
    }

    const last = path[path.length - 1]
    return path.slice(0, -1).concat(last + 1)
  },

  operationCanTransformPath(
    operation: Operation
  ): operation is
    | InsertNodeOperation
    | RemoveNodeOperation
    | MergeNodeOperation
    | SplitNodeOperation
    | MoveNodeOperation {
    switch (operation.type) {
      case 'insert_node':
      case 'remove_node':
      case 'merge_node':
      case 'split_node':
      case 'move_node':
        return true
      default:
        return false
    }
  },

  parent(path: Path): Path | undefined {
    if (path.length === 0) {
      return
    }

    return path.slice(0, -1)
  },

  previous(path: Path): Path | undefined {
    if (path.length === 0) {
      return
    }

    const last = path[path.length - 1]

    if (last <= 0) {
      return
    }

    return path.slice(0, -1).concat(last - 1)
  },

  relative(path: Path, ancestor: Path): Path | undefined {
    if (!Path.isAncestor(ancestor, path) && !Path.equals(path, ancestor)) {
      return
    }

    return path.slice(ancestor.length)
  },

  transform(
    path: Path | null,
    operation: Operation,
    options: PathTransformOptions = {}
  ): Path | null {
    if (!path) return null

    // PERF: use destructing instead of immer
    const p = [...path]
    const { affinity = 'forward' } = options

    // PERF: Exit early if the operation is guaranteed not to have an effect.
    if (path.length === 0) {
      return p
    }

    switch (operation.type) {
      case 'insert_node': {
        const { path: op } = operation

        if (
          Path.equals(op, p) ||
          Path.endsBefore(op, p) ||
          Path.isAncestor(op, p)
        ) {
          p[op.length - 1] += 1
        }

        break
      }

      case 'remove_node': {
        const { path: op } = operation

        if (Path.equals(op, p) || Path.isAncestor(op, p)) {
          return null
        } else if (Path.endsBefore(op, p)) {
          p[op.length - 1] -= 1
        }

        break
      }

      case 'merge_node': {
        const { path: op, position } = operation

        if (Path.equals(op, p) || Path.endsBefore(op, p)) {
          p[op.length - 1] -= 1
        } else if (Path.isAncestor(op, p)) {
          p[op.length - 1] -= 1
          p[op.length] += position
        }

        break
      }

      case 'split_node': {
        const { path: op, position } = operation

        if (Path.equals(op, p)) {
          if (affinity === 'forward') {
            p[p.length - 1] += 1
          } else if (affinity === 'backward') {
            // Nothing, because it still refers to the right path.
          } else {
            return null
          }
        } else if (Path.endsBefore(op, p)) {
          p[op.length - 1] += 1
        } else if (Path.isAncestor(op, p) && path[op.length] >= position) {
          p[op.length - 1] += 1
          p[op.length] -= position
        }

        break
      }

      case 'move_node': {
        const { path: op, newPath: onp } = operation

        // If the old and new path are the same, it's a no-op.
        if (Path.equals(op, onp)) {
          return p
        }

        if (Path.isAncestor(op, p) || Path.equals(op, p)) {
          const copy = onp.slice()

          if (Path.endsBefore(op, onp) && op.length < onp.length) {
            copy[op.length - 1] -= 1
          }

          return copy.concat(p.slice(op.length))
        } else if (
          Path.isSibling(op, onp) &&
          (Path.isAncestor(onp, p) || Path.equals(onp, p))
        ) {
          if (Path.endsBefore(op, p)) {
            p[op.length - 1] -= 1
          } else {
            p[op.length - 1] += 1
          }
        } else if (
          Path.endsBefore(onp, p) ||
          Path.equals(onp, p) ||
          Path.isAncestor(onp, p)
        ) {
          if (Path.endsBefore(op, p)) {
            p[op.length - 1] -= 1
          }

          p[onp.length - 1] += 1
        } else if (Path.endsBefore(op, p)) {
          if (Path.equals(onp, p)) {
            p[onp.length - 1] += 1
          }

          p[op.length - 1] -= 1
        }

        break
      }
    }

    return p
  },
}
