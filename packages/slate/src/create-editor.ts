import {
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
  Transforms,
} from './'
import { DIRTY_PATHS, FLUSHING, DECORATIONS } from './utils/weak-maps'


/**
 * Create a new Slate `Editor` object.
 */

export const createEditor = (): Editor => {
  const editor: Editor = {
    children: [],
    operations: [],
    selection: null,
    marks: null,
    isInline: () => false,
    isVoid: () => false,
    onChange: () => {},
    addDecoration: (key: string, range: Range) => {
      editor.decorations.push({
        key,
        rangeRef: Editor.rangeRef(editor, range)
      })
    },
    removeDecorations: (key: string, range: Range) => {
      editor.decorations = editor.decorations.filter(
        (decoration) => {
          const decorationRange = decoration.rangeRef.current
          if (!decorationRange) {
            return false
          }
          if (
            decoration.key === key &&
            Range.includes(range, decorationRange)
          ) {
            decoration.rangeRef.unref()
            return false
          }

          return true
        }
      )
    },
    decorations: [],
    apply: (op: Operation) => {
      for (const ref of Editor.pathRefs(editor)) {
        PathRef.transform(ref, op)
      }

      // for (const decoration of editor.decorations) {
      //   RangeRef.transform(decoration.rangeRef, op)
      // }

      for (const ref of Editor.pointRefs(editor)) {
        PointRef.transform(ref, op)
      }

      for (const ref of Editor.rangeRefs(editor)) {
        RangeRef.transform(ref, op)
      }

      const dirtyPaths = getDirtyPaths(editor, op)
      DIRTY_PATHS.set(editor, dirtyPaths)

      Transforms.transform(editor, op)
      editor.operations.push(op)
      Editor.normalize(editor)

      // Clear any formats applied to the cursor if the selection changes.
      if (op.type === 'set_selection') {
        editor.marks = null
      }

      if (!FLUSHING.get(editor)) {
        FLUSHING.set(editor, true)

        Promise.resolve().then(() => {
          FLUSHING.set(editor, false)
          editor.onChange()
          editor.operations = []
        })
      }
    },

    addMark: (key: string, value: any) => {
      const { selection } = editor

      if (selection) {
        if (Range.isExpanded(selection)) {
          Transforms.setNodes(
            editor,
            { [key]: value },
            { match: Text.isText, split: true }
          )
        } else {
          const marks = {
            ...(Editor.marks(editor) || {}),
            [key]: value,
          }

          editor.marks = marks
          if (!FLUSHING.get(editor)) {
            editor.onChange()
          }
        }
      }
    },

    deleteBackward: (unit: 'character' | 'word' | 'line' | 'block') => {
      const { selection } = editor

      if (selection && Range.isCollapsed(selection)) {
        Transforms.delete(editor, { unit, reverse: true })
      }
    },

    deleteForward: (unit: 'character' | 'word' | 'line' | 'block') => {
      const { selection } = editor

      if (selection && Range.isCollapsed(selection)) {
        Transforms.delete(editor, { unit })
      }
    },

    deleteFragment: (direction?: 'forward' | 'backward') => {
      const { selection } = editor

      if (selection && Range.isExpanded(selection)) {
        Transforms.delete(editor, { reverse: direction === 'backward' })
      }
    },

    getFragment: () => {
      const { selection } = editor

      if (selection) {
        return Node.fragment(editor, selection)
      }
      return []
    },

    insertBreak: () => {
      Transforms.splitNodes(editor, { always: true })
    },

    insertFragment: (fragment: Node[]) => {
      Transforms.insertFragment(editor, fragment)
    },

    insertNode: (node: Node) => {
      Transforms.insertNodes(editor, node)
    },

    insertText: (text: string) => {
      const { selection, marks } = editor

      if (selection) {
        if (marks) {
          const node = { text, ...marks }
          Transforms.insertNodes(editor, node)
        } else {
          Transforms.insertText(editor, text)
        }

        editor.marks = null
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
        const child = { text: '' }
        Transforms.insertNodes(editor, child, {
          at: path.concat(0),
          voids: true,
        })
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
        const currentNode = Node.get(editor, path)
        if (Text.isText(currentNode)) continue
        const child = node.children[i] as Descendant
        const prev = currentNode.children[n - 1] as Descendant
        const isLast = i === node.children.length - 1
        const isInlineOrText =
          Text.isText(child) ||
          (Element.isElement(child) && editor.isInline(child))

        // Only allow block nodes in the top-level children and parent blocks
        // that only contain block nodes. Similarly, only allow inline nodes in
        // other inline nodes, or parent blocks that only contain inlines and
        // text.
        if (isInlineOrText !== shouldHaveInlines) {
          Transforms.removeNodes(editor, { at: path.concat(n), voids: true })
          n--
        } else if (Element.isElement(child)) {
          // Ensure that inline nodes are surrounded by text nodes.
          if (editor.isInline(child)) {
            if (prev == null || !Text.isText(prev)) {
              const newChild = { text: '' }
              Transforms.insertNodes(editor, newChild, {
                at: path.concat(n),
                voids: true,
              })
              n++
            } else if (isLast) {
              const newChild = { text: '' }
              Transforms.insertNodes(editor, newChild, {
                at: path.concat(n + 1),
                voids: true,
              })
              n++
            }
          }
        } else {
          // Merge adjacent text nodes that are empty or match.
          if (prev != null && Text.isText(prev)) {
            if (Text.equals(child, prev, { loose: true })) {
              Transforms.mergeNodes(editor, { at: path.concat(n), voids: true })
              n--
            } else if (prev.text === '') {
              Transforms.removeNodes(editor, {
                at: path.concat(n - 1),
                voids: true,
              })
              n--
            } else if (child.text === '') {
              Transforms.removeNodes(editor, {
                at: path.concat(n),
                voids: true,
              })
              n--
            }
          }
        }
      }
    },

    removeMark: (key: string) => {
      const { selection } = editor

      if (selection) {
        if (Range.isExpanded(selection)) {
          Transforms.unsetNodes(editor, key, {
            match: Text.isText,
            split: true,
          })
        } else {
          const marks = { ...(Editor.marks(editor) || {}) }
          delete marks[key]
          editor.marks = marks
          if (!FLUSHING.get(editor)) {
            editor.onChange()
          }
        }
      }
    },
  }

  return editor
}


/**
 * Get the old and new dirty paths combined for an op
 */
const getDirtyPaths = (editor: Editor, op: Operation) => {
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
  const newDirtyPaths = getDirtyPathsForOp(op)

  for (const path of oldDirtyPaths) {
    const newPath = Path.transform(path, op)
    add(newPath)
  }

  for (const path of newDirtyPaths) {
    add(path)
  }

  return dirtyPaths
}

/**
 * Get the "dirty" paths generated from an operation.
 */
const getDirtyPathsForOp = (op: Operation): Path[] => {
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
