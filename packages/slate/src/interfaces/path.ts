import {
  Operation,
  PathTransformingOperation,
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
   * Get the number of ancestors two paths share (not including the root).
   * This is equivalent to the length of the path returned by {@link Path.common}, but doesn't allocate a new array.
   */
  commonDepth: (path: Path, another: Path) => number

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
  next: (path: Path) => Path

  /**
   * Returns whether this operation can affect paths or not. Used as an
   * optimization when updating dirty paths during normalization
   *
   * NOTE: This *must* be kept in sync with the implementation of 'transform'
   * below
   */
  operationCanTransformPath: (
    operation: Operation
  ) => operation is PathTransformingOperation

  /**
   * Given a path, return a new path referring to the parent node above it.
   */
  parent: (path: Path) => Path

  /**
   * Given a path, get the path to the previous sibling node.
   */
  previous: (path: Path) => Path

  /**
   * Get a path relative to an ancestor.
   */
  relative: (path: Path, ancestor: Path) => Path

  /**
   * Transform a path by an operation.
   * Unaffected paths are returned as-is. If a path is removed by an operation, `null` is returned.
   *
   * @param path The path to transform
   * @param operation The operation to transform the path by
   * @param options.affinity If the path is split, which side of the split to return, or to return `null`. Defaults to `"forward"`.
   * @returns A path representing where the input path would be after the operation is applied, or `null` if the path woould be removed.
   */
  transform(
    path: Path,
    operation: Exclude<Operation, RemoveNodeOperation | SplitNodeOperation>,
    options?: PathTransformOptions
  ): Path
  transform(
    path: Path,
    operation: SplitNodeOperation,
    options?: Exclude<PathTransformOptions, { affinity: null }>
  ): Path
  transform(
    path: Path,
    operation: Operation,
    options?: PathTransformOptions
  ): Path | null
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

  commonDepth(path: Path, another: Path): number {
    const min = Math.min(path.length, another.length)
    let i = 0
    while (i < min && path[i] === another[i]) i++

    return i
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
      path === another ||
      (path.length === another.length && path.every((n, i) => n === another[i]))
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
    return Array.isArray(value) && value.every(n => typeof n === 'number')
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

  next(path: Path): Path {
    if (path.length === 0) {
      throw new Error(
        `Cannot get the next path of a root path [${path}], because it has no next index.`
      )
    }

    const last = path[path.length - 1]
    return path.slice(0, -1).concat(last + 1)
  },

  operationCanTransformPath(
    operation: Operation
  ): operation is PathTransformingOperation {
    return Operation.transformsPaths(operation)
  },

  parent(path: Path): Path {
    if (path.length === 0) {
      throw new Error(`Cannot get the parent path of the root path [${path}].`)
    }

    return path.slice(0, -1)
  },

  previous(path: Path): Path {
    if (path.length === 0) {
      throw new Error(
        `Cannot get the previous path of a root path [${path}], because it has no previous index.`
      )
    }

    const last = path[path.length - 1]

    if (last <= 0) {
      throw new Error(
        `Cannot get the previous path of a first child path [${path}] because it would result in a negative index.`
      )
    }

    return path.slice(0, -1).concat(last - 1)
  },

  relative(path: Path, ancestor: Path): Path {
    if (!Path.isAncestor(ancestor, path) && !Path.equals(path, ancestor)) {
      throw new Error(
        `Cannot get the relative path of [${path}] inside ancestor [${ancestor}], because it is not above or equal to the path.`
      )
    }

    return path.slice(ancestor.length)
  },

  transform: ((
    path: Path,
    operation: Operation,
    options: PathTransformOptions = {}
  ): Path | null => {
    const { type } = operation
    if (!('path' in operation)) return path
    const { path: op } = operation

    if (
      op.length > path.length &&
      (type !== 'move_node' || operation.newPath.length > path.length)
    ) {
      return path // PERF: Exit early if change is only deeper in the tree
    }

    // basically if an operation shifts the earlier children of an ancestor, our path needs to shift index to compensate

    // PERF: we calculate commonDepth once instead of each function calling it seperately.
    const commonDepth = Path.commonDepth(path, op)

    const opDepth = op.length - 1 // depth of the children array where the operation is performed
    const opEqOrAbovePath = commonDepth === op.length
    const opEqualPath = commonDepth === path.length // only accurate because we can guarantee cd <= op.length <= p.length (except during move_node, but that doesnt use this value)

    // true if `op` is an earlier sibling of `path` or of one of its ancestors
    const opEndsBeforePath =
      commonDepth === opDepth && op[commonDepth] < path[commonDepth]

    if (!opEqOrAbovePath && !opEndsBeforePath && type !== 'move_node') {
      return path // PERF: Exit early if operation does not affect path
    }

    const outPath = path.slice()
    switch (type) {
      case 'insert_node': {
        if (opEqOrAbovePath || opEndsBeforePath) {
          outPath[opDepth] += 1
        }

        return outPath
      }

      case 'remove_node': {
        if (opEqOrAbovePath) {
          return null
        } else if (opEndsBeforePath) {
          outPath[opDepth] -= 1
        }

        return outPath
      }

      case 'merge_node': {
        const { position } = operation

        if (opEqualPath || opEndsBeforePath) {
          outPath[opDepth] -= 1
        } else if (opEqOrAbovePath) {
          outPath[opDepth] -= 1
          outPath[op.length] += position
        }

        return outPath
      }

      case 'split_node': {
        const { position } = operation
        const { affinity = 'forward' } = options

        if (opEqualPath) {
          if (affinity === 'forward') {
            outPath[opDepth] += 1
          } else if (affinity === 'backward') {
            return path
          } else {
            return null
          }
        } else if (opEndsBeforePath) {
          outPath[opDepth] += 1
        } else if (opEqOrAbovePath && path[commonDepth] >= position) {
          outPath[opDepth] += 1
          outPath[op.length] -= position
        } else {
          return path
        }

        return outPath
      }

      case 'move_node': {
        const { newPath: newOp } = operation

        if (opEqOrAbovePath) {
          // we are at or inside the node being moved

          const commonDepthBetween = Path.commonDepth(op, newOp)

          // If the old and new path are the same, it's a no-op.
          // (this is also the case if the new path is a descendant of the old path, which is invalid since a node cannot be moved inside itself)
          if (commonDepthBetween === op.length) {
            return path
          }

          outPath.splice(0, op.length, ...newOp)

          const opEndsBeforeNewOp =
            commonDepthBetween === opDepth &&
            op[commonDepthBetween] < newOp[commonDepthBetween]

          if (opEndsBeforeNewOp && op.length < newOp.length) {
            // the new path is affected by the removal of the old node, adjust to compensate
            outPath[opDepth] -= 1
          }
          return outPath
        }

        const newCommonDepth = Path.commonDepth(path, newOp)

        const newOpDepth = newOp.length - 1 // depth of the children array where the new node is inserted
        const newOpEqOrAbovePath = newCommonDepth === newOp.length

        // true if `newOp` is an earlier sibling of `path` or of one of its ancestors
        const newOpEndsBeforePath =
          newCommonDepth === newOpDepth &&
          newOp[newCommonDepth] < path[newCommonDepth]

        if (opEndsBeforePath) {
          if (newOpEndsBeforePath && opDepth === newOpDepth) {
            return path // affected by both insertion and removal at same depth, they cancel eachother out
          } else if (
            (newOpEqOrAbovePath || newOpEndsBeforePath) &&
            opDepth !== newOpDepth
          ) {
            // affected by both insertion and removal at different depths
            outPath[opDepth] -= 1
            outPath[newOpDepth] += 1
          } else {
            outPath[opDepth] -= 1 // only affected by removal at old path
          }
        } else if (newOpEqOrAbovePath || newOpEndsBeforePath) {
          outPath[newOpDepth] += 1 // only affected by insertion at new path
        } else {
          return path // totally unaffected
        }

        return outPath
      }
    }

    return path
  }) as PathInterface['transform'],
}
