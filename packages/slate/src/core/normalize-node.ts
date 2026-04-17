import { WithEditorFirstArg } from '../utils/types'
import {
  Editor,
  EditorNormalizeOptions,
  Element,
  Descendant,
  Text,
  Transforms,
  Node,
  Path,
  Ancestor,
} from '../interfaces'
import { isObservingBatchNormalize } from './batch'

const isDirectChildPath = (parentPath: Path, childPath: Path) =>
  childPath.length === parentPath.length + 1 &&
  Path.equals(Path.parent(childPath), parentPath)

const getBlockOnlyChildIndexesToValidate = (
  path: Path,
  operation?: EditorNormalizeOptions['operation']
) => {
  if (!operation) {
    return null
  }

  switch (operation.type) {
    case 'set_node':
    case 'insert_node': {
      if (
        Path.equals(path, operation.path) ||
        Path.isAncestor(path, operation.path)
      ) {
        return isDirectChildPath(path, operation.path)
          ? [operation.path[path.length]]
          : []
      }

      if (operation.type === 'insert_node') {
        const parentPath = Path.parent(operation.path)

        if (
          Path.equals(path, parentPath) ||
          Path.isAncestor(path, parentPath)
        ) {
          return isDirectChildPath(path, operation.path)
            ? [operation.path[path.length]]
            : []
        }
      }

      return null
    }

    case 'insert_text':
    case 'remove_text': {
      return []
    }

    case 'split_node':
    case 'merge_node': {
      return Path.isAncestor(path, operation.path) ? [] : null
    }

    case 'set_selection': {
      return []
    }

    case 'remove_node': {
      if (
        Path.equals(path, operation.path) ||
        Path.isAncestor(path, operation.path)
      ) {
        return []
      }

      return null
    }

    case 'move_node': {
      const removesFromParent = Path.isAncestor(path, operation.path)
      const insertsIntoParent = Path.isAncestor(path, operation.newPath)

      if (!removesFromParent && !insertsIntoParent) {
        return null
      }

      return isDirectChildPath(path, operation.path)
        ? insertsIntoParent && isDirectChildPath(path, operation.newPath)
          ? [operation.newPath[path.length]]
          : []
        : insertsIntoParent && isDirectChildPath(path, operation.newPath)
        ? [operation.newPath[path.length]]
        : []
    }

    default: {
      return null
    }
  }
}

export const normalizeNode: WithEditorFirstArg<Editor['normalizeNode']> = (
  editor,
  entry,
  options
) => {
  const { force = false, operation } = options ?? {}
  const [node, path] = entry as [{}, Path] // node is not yet normalized, treat as hostile

  // There are no core normalizations for text nodes.
  if (Node.isText(node as Node)) {
    return
  }

  if (!('children' in node)) {
    // If the node is not a text node, and doesn't have a `children` field,
    // then we have an invalid node that will upset slate.
    //
    // eg: `{ type: 'some_node' }`.
    //
    // To prevent slate from breaking, we can add the `children` field,
    // and now that it is valid, we can to many more operations easily,
    // such as extend normalizers to fix erronous structure.
    ;(node as Element).children = []
  }
  let element = node as Ancestor // we will have to refetch the element any time we modify its children since it clones to a new immutable reference when we do

  // Ensure that elements have at least one child.
  if (element !== editor && element.children.length === 0) {
    const child = { text: '' }
    Transforms.insertNodes(editor, child, { at: path.concat(0), voids: true })
    element = Node.get(editor, path) as Element
  }

  // Determine whether the node should have only block or only inline children.
  // - The editor should have only block children.
  // - Inline elements should have only inline children.
  // - Elements that begin with a text child or an inline element child should have only inline children.
  // - All other elements should have only block children.
  const shouldHaveInlines =
    !(element === editor) &&
    (editor.isInline(element) ||
      Node.isText(element.children[0]) ||
      editor.isInline(element.children[0]))

  if (shouldHaveInlines) {
    // Since we'll be applying operations while iterating, we also modify `n` when adding/removing nodes.
    for (let n = 0; n < element.children.length; n++) {
      const child = element.children[n]
      const prev = element.children[n - 1] as Descendant | undefined

      if (Node.isText(child)) {
        if (prev != null && Node.isText(prev)) {
          // Merge adjacent text nodes that are empty or match.
          if (child.text === '') {
            Transforms.removeNodes(editor, {
              at: path.concat(n),
              voids: true,
            })
            element = Node.get(editor, path) as Element
            n--
          } else if (prev.text === '') {
            Transforms.removeNodes(editor, {
              at: path.concat(n - 1),
              voids: true,
            })
            element = Node.get(editor, path) as Element
            n--
          } else if (Text.equals(child, prev, { loose: true })) {
            Transforms.mergeNodes(editor, { at: path.concat(n), voids: true })
            element = Node.get(editor, path) as Element
            n--
          }
        }
      } else {
        if (editor.isInline(child)) {
          // Ensure that inline nodes are surrounded by text nodes.
          if (prev == null || !Node.isText(prev)) {
            const newChild = { text: '' }
            Transforms.insertNodes(editor, newChild, {
              at: path.concat(n),
              voids: true,
            })
            element = Node.get(editor, path) as Element
            n++
          }
          if (n === element.children.length - 1) {
            const newChild = { text: '' }
            Transforms.insertNodes(editor, newChild, {
              at: path.concat(n + 1),
              voids: true,
            })
            element = Node.get(editor, path) as Element
            n++
          }
        } else {
          // Allow only inline nodes to be in other inline nodes, or in parent blocks that only
          // contain inlines and text.
          Transforms.unwrapNodes(editor, { at: path.concat(n), voids: true })
          element = Node.get(editor, path) as Element
          n--
        }
      }
    }
  } else {
    const isInlineChild = (child: Descendant) =>
      Element.isElement(child) && editor.isInline(child)

    const normalizeBlockChild = (index: number) => {
      const child = element.children[index]

      if (!child || (!Node.isText(child) && !isInlineChild(child))) {
        return
      }

      if (options?.fallbackElement) {
        Transforms.wrapNodes(editor, options.fallbackElement(), {
          at: path.concat(index),
          voids: true,
        })
      } else {
        Transforms.removeNodes(editor, { at: path.concat(index), voids: true })
      }

      element = Node.get(editor, path) as Ancestor
    }

    const childIndexesToValidate =
      force ||
      (isObservingBatchNormalize(editor) && editor.operations.length !== 1)
        ? null
        : getBlockOnlyChildIndexesToValidate(path, operation)

    if (Array.isArray(childIndexesToValidate)) {
      for (const index of childIndexesToValidate) {
        normalizeBlockChild(index)
      }

      return
    }

    // Since we'll be applying operations while iterating, we also modify `n` when adding/removing nodes
    for (let n = 0; n < element.children.length; n++) {
      // Allow only block nodes in the top-level children and parent blocks that only contain block nodes
      if (
        Node.isText(element.children[n]) ||
        isInlineChild(element.children[n])
      ) {
        normalizeBlockChild(n)
        n--
      }
    }
  }
}
