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
import { DIRTY_PATHS, FLUSHING } from './utils/weak-maps'

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
          editor.onChange()
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

    deleteFragment: () => {
      const { selection } = editor

      if (selection && Range.isExpanded(selection)) {
        Transforms.delete(editor)
      }
    },

    getFragment: () => {
      const { selection } = editor

      if (selection && Range.isExpanded(selection)) {
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
        // If the cursor is at the end of an inline, move it outside of
        // the inline before inserting
        if (Range.isCollapsed(selection)) {
          const inline = Editor.above(editor, {
            match: n => Editor.isInline(editor, n),
            mode: 'highest',
          })

          if (inline) {
            const [, inlinePath] = inline

            if (Editor.isEnd(editor, selection.anchor, inlinePath)) {
              const point = Editor.after(editor, inlinePath)!
              Transforms.setSelection(editor, {
                anchor: point,
                focus: point,
              })
            }
          }
        }

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

      for (let i = 0; i < node.children.length; i++) {
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
          Transforms.removeNodes(editor, { at: path.concat(i), voids: true })
          break
        } else if (Element.isElement(child)) {
          // Ensure that inline nodes are surrounded by text nodes.
          if (editor.isInline(child)) {
            if (prev == null || !Text.isText(prev)) {
              const newChild = { text: '' }
              Transforms.insertNodes(editor, newChild, {
                at: path.concat(i),
                voids: true,
              })
              break
            } else if (isLast) {
              const newChild = { text: '' }
              Transforms.insertNodes(editor, newChild, {
                at: path.concat(i + 1),
                voids: true,
              })
              break
            }
          }
        } else {
          // Merge adjacent text nodes that are empty or match.
          if (prev != null && Text.isText(prev)) {
            if (Text.equals(child, prev, { loose: true })) {
              Transforms.mergeNodes(editor, { at: path.concat(i), voids: true })
              break
            } else if (prev.text === '') {
              Transforms.removeNodes(editor, {
                at: path.concat(i - 1),
                voids: true,
              })
              break
            } else if (isLast && child.text === '') {
              Transforms.removeNodes(editor, {
                at: path.concat(i),
                voids: true,
              })
              break
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
          editor.onChange()
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
