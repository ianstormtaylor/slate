import {
  Command,
  Descendant,
  Editor,
  Element,
  Node,
  NodeEntry,
  Operation,
  Path,
  PathRef,
  PointRef,
  Range,
  RangeRef,
  Text,
} from '.'
import { DIRTY_PATHS } from './interfaces/editor/transforms/general'

const FLUSHING: WeakMap<Editor, boolean> = new WeakMap()

/**
 * Create a new Slate `Editor` object.
 */

export const createEditor = (): Editor => {
  const editor: Editor = {
    children: [],
    operations: [],
    selection: null,
    isInline: () => false,
    isVoid: () => false,
    onChange: () => {},
    apply: (op: Operation) => {
      for (const ref of Editor.pathRefs(editor)) {
        PathRef.transform(ref, op)
      }

      for (const ref of Editor.pointRefs(editor)) {
        PointRef.transform(ref, op)
      }

      for (const ref of Editor.rangeRefs(editor)) {
        RangeRef.transform(ref, op)
      }

      const set = new Set()
      const dirtyPaths: Path[] = []

      const add = (path: Path | null) => {
        if (path) {
          const key = path.join(',')

          if (!set.has(key)) {
            set.add(key)
            dirtyPaths.push(path)
          }
        }
      }

      const oldDirtyPaths = DIRTY_PATHS.get(editor) || []
      const newDirtyPaths = getDirtyPaths(op)

      for (const path of oldDirtyPaths) {
        const newPath = Path.transform(path, op)
        add(newPath)
      }

      for (const path of newDirtyPaths) {
        add(path)
      }

      DIRTY_PATHS.set(editor, dirtyPaths)
      Editor.transform(editor, op)
      editor.operations.push(op)
      Editor.normalize(editor)

      if (!FLUSHING.get(editor)) {
        FLUSHING.set(editor, true)

        Promise.resolve().then(() => {
          FLUSHING.set(editor, false)
          editor.onChange(editor.children, editor.operations)
          editor.operations = []
        })
      }
    },
    exec: (command: Command) => {
      const { selection } = editor

      if (Command.isCoreCommand(command)) {
        switch (command.type) {
          case 'add_mark': {
            Editor.addMarks(editor, [command.mark])
            break
          }

          case 'delete_backward': {
            if (selection && Range.isCollapsed(selection)) {
              Editor.delete(editor, { unit: command.unit, reverse: true })
            }

            break
          }

          case 'delete_forward': {
            if (selection && Range.isCollapsed(selection)) {
              Editor.delete(editor, { unit: command.unit })
            }

            break
          }

          case 'delete_fragment': {
            if (selection && Range.isExpanded(selection)) {
              Editor.delete(editor)
            }

            break
          }

          case 'insert_break': {
            Editor.splitNodes(editor, { always: true })
            break
          }

          case 'insert_fragment': {
            Editor.insertFragment(editor, command.fragment)
            break
          }

          case 'insert_node': {
            Editor.insertNodes(editor, [command.node])
            break
          }

          case 'insert_text': {
            Editor.insertText(editor, command.text)
            break
          }

          case 'remove_mark': {
            Editor.removeMarks(editor, [command.mark])
            break
          }
        }
      }
    },
    normalizeNode: (entry: NodeEntry) => {
      const [node, path] = entry

      // There are no core normalizations for text nodes.
      if (Text.isText(node)) {
        return
      }

      // Ensure that block and inline nodes have at least one text child.
      if (Element.isElement(node) && node.children.length === 0) {
        const child = { text: '', marks: [] }
        Editor.insertNodes(editor, child, { at: path.concat(0) })
        return
      }

      // Determine whether the node should have block or inline children.
      const shouldHaveInlines = Editor.isEditor(node)
        ? false
        : Element.isElement(node) &&
          (editor.isInline(node) ||
            node.children.length === 0 ||
            Text.isText(node.children[0]) ||
            editor.isInline(node.children[0]))

      // Since we'll be applying operations while iterating, keep track of an
      // index that accounts for any added/removed nodes.
      let n = 0

      for (let i = 0; i < node.children.length; i++, n++) {
        const child = node.children[i] as Descendant
        const prev = node.children[i - 1] as Descendant
        const isLast = i === node.children.length - 1
        const isInlineOrText =
          Text.isText(child) ||
          (Element.isElement(child) && editor.isInline(child))

        // Only allow block nodes in the top-level children and parent blocks
        // that only contain block nodes. Similarly, only allow inline nodes in
        // other inline nodes, or parent blocks that only contain inlines and
        // text.
        if (isInlineOrText !== shouldHaveInlines) {
          Editor.removeNodes(editor, { at: path.concat(n) })
          n--
          continue
        }

        if (Element.isElement(child)) {
          // Ensure that inline nodes are surrounded by text nodes.
          if (editor.isInline(child)) {
            if (prev == null || !Text.isText(prev)) {
              const newChild = { text: '', marks: [] }
              Editor.insertNodes(editor, newChild, { at: path.concat(n) })
              n++
              continue
            }

            if (isLast) {
              const newChild = { text: '', marks: [] }
              Editor.insertNodes(editor, newChild, { at: path.concat(n + 1) })
              n++
              continue
            }
          }
        } else {
          // Merge adjacent text nodes that are empty or have matching marks.
          if (prev != null && Text.isText(prev)) {
            if (Text.matches(child, prev)) {
              Editor.mergeNodes(editor, { at: path.concat(n) })
              n--
              continue
            } else if (prev.text === '') {
              Editor.removeNodes(editor, { at: path.concat(n - 1) })
              n--
              continue
            } else if (isLast && child.text === '') {
              Editor.removeNodes(editor, { at: path.concat(n) })
              n--
              continue
            }
          }
        }
      }
    },
  }

  return editor
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
        const p = Path.transform(ancestor, op)
        oldAncestors.push(p!)
      }

      for (const ancestor of Path.ancestors(newPath)) {
        const p = Path.transform(ancestor, op)
        newAncestors.push(p!)
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
