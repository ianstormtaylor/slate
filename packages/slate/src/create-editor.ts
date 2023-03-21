import {
  Descendant,
  Editor,
  Element,
  Node,
  Operation,
  Path,
  PathRef,
  PointRef,
  Range,
  RangeRef,
  Text,
  Transforms,
} from './'
import { TextUnit } from './interfaces/types'
import { DIRTY_PATH_KEYS, DIRTY_PATHS, FLUSHING } from './utils/weak-maps'

/**
 * Create a new Slate `Editor` object.
 */

export const createEditor = (): Editor => {
  const editor: Editor = {
    children: [],
    operations: [],
    selection: null,
    marks: null,
    isElementReadOnly: () => false,
    isInline: () => false,
    isSelectable: () => true,
    isVoid: () => false,
    markableVoid: () => false,
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

      const oldDirtyPaths = DIRTY_PATHS.get(editor) || []
      const oldDirtyPathKeys = DIRTY_PATH_KEYS.get(editor) || new Set()
      let dirtyPaths: Path[]
      let dirtyPathKeys: Set<string>

      const add = (path: Path | null) => {
        if (path) {
          const key = path.join(',')

          if (!dirtyPathKeys.has(key)) {
            dirtyPathKeys.add(key)
            dirtyPaths.push(path)
          }
        }
      }

      if (Path.operationCanTransformPath(op)) {
        dirtyPaths = []
        dirtyPathKeys = new Set()
        for (const path of oldDirtyPaths) {
          const newPath = Path.transform(path, op)
          add(newPath)
        }
      } else {
        dirtyPaths = oldDirtyPaths
        dirtyPathKeys = oldDirtyPathKeys
      }

      const newDirtyPaths = editor.getDirtyPaths(op)
      for (const path of newDirtyPaths) {
        add(path)
      }

      DIRTY_PATHS.set(editor, dirtyPaths)
      DIRTY_PATH_KEYS.set(editor, dirtyPathKeys)
      Transforms.transform(editor, op)
      editor.operations.push(op)
      Editor.normalize(editor, {
        operation: op,
      })

      // Clear any formats applied to the cursor if the selection changes.
      if (op.type === 'set_selection') {
        editor.marks = null
      }

      if (!FLUSHING.get(editor)) {
        FLUSHING.set(editor, true)

        Promise.resolve().then(() => {
          FLUSHING.set(editor, false)
          editor.onChange({ operation: op })
          editor.operations = []
        })
      }
    },

    addMark: (key: string, value: any) => {
      const { selection, markableVoid } = editor

      if (selection) {
        const match = (node: Node, path: Path) => {
          if (!Text.isText(node)) {
            return false // marks can only be applied to text
          }
          const [parentNode, parentPath] = Editor.parent(editor, path)
          return !editor.isVoid(parentNode) || editor.markableVoid(parentNode)
        }
        const expandedSelection = Range.isExpanded(selection)
        let markAcceptingVoidSelected = false
        if (!expandedSelection) {
          const [selectedNode, selectedPath] = Editor.node(editor, selection)
          if (selectedNode && match(selectedNode, selectedPath)) {
            const [parentNode] = Editor.parent(editor, selectedPath)
            markAcceptingVoidSelected =
              parentNode && editor.markableVoid(parentNode)
          }
        }
        if (expandedSelection || markAcceptingVoidSelected) {
          Transforms.setNodes(
            editor,
            { [key]: value },
            {
              match,
              split: true,
              voids: true,
            }
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

    deleteBackward: (unit: TextUnit) => {
      const { selection } = editor

      if (selection && Range.isCollapsed(selection)) {
        Transforms.delete(editor, { unit, reverse: true })
      }
    },

    deleteForward: (unit: TextUnit) => {
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

    insertSoftBreak: () => {
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

    normalizeNode: entry => {
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
        const match = (node: Node, path: Path) => {
          if (!Text.isText(node)) {
            return false // marks can only be applied to text
          }
          const [parentNode, parentPath] = Editor.parent(editor, path)
          return !editor.isVoid(parentNode) || editor.markableVoid(parentNode)
        }
        const expandedSelection = Range.isExpanded(selection)
        let markAcceptingVoidSelected = false
        if (!expandedSelection) {
          const [selectedNode, selectedPath] = Editor.node(editor, selection)
          if (selectedNode && match(selectedNode, selectedPath)) {
            const [parentNode] = Editor.parent(editor, selectedPath)
            markAcceptingVoidSelected =
              parentNode && editor.markableVoid(parentNode)
          }
        }
        if (expandedSelection || markAcceptingVoidSelected) {
          Transforms.unsetNodes(editor, key, {
            match,
            split: true,
            voids: true,
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

    /**
     * Get the "dirty" paths generated from an operation.
     */

    getDirtyPaths: (op: Operation): Path[] => {
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
    },

    shouldNormalize: ({ iteration, initialDirtyPathsLength }) => {
      const maxIterations = initialDirtyPathsLength * 42 // HACK: better way?

      if (iteration > maxIterations) {
        throw new Error(
          `Could not completely normalize the editor after ${maxIterations} iterations! This is usually due to incorrect normalization logic that leaves a node in an invalid state.`
        )
      }

      return true
    },
  }

  return editor
}
