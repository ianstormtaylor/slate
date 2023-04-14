import { WithEditorFirstArg } from '../utils/types'
import { Path } from '../interfaces/path'
import { Text } from '../interfaces/text'
import { Node } from '../interfaces/node'
import { Editor } from '../interfaces/editor'

/**
 * Get the "dirty" paths generated from an operation.
 */
export const getDirtyPaths: WithEditorFirstArg<Editor['getDirtyPaths']> = (
  editor,
  op
) => {
  switch (op.type) {
    case 'insert_text':
    case 'remove_text':
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
        const p = Path.transform(ancestor, op)
        oldAncestors.push(p!)
      }

      for (const ancestor of Path.ancestors(newPath)) {
        const p = Path.transform(ancestor, op)
        newAncestors.push(p!)
      }

      const newParent = newAncestors[newAncestors.length - 1]
      const newIndex = newPath[newPath.length - 1]
      const resultPath = newParent.concat(newIndex)

      return [...oldAncestors, ...newAncestors, resultPath]
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
