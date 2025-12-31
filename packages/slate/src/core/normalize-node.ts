import { WithEditorFirstArg } from '../utils/types'
import { Text } from '../interfaces/text'
import { Element } from '../interfaces/element'
import { Transforms } from '../interfaces/transforms'
import { Descendant, Node } from '../interfaces/node'
import { Editor } from '../interfaces/editor'

export const normalizeNode: WithEditorFirstArg<Editor['normalizeNode']> = (
  editor,
  entry,
  options
) => {
  const [node, path] = entry

  // There are no core normalizations for text nodes.
  if (Node.isText(node)) {
    return
  }

  // Ensure that block and inline nodes have at least one text child.
  if (Node.isElement(node) && node.children.length === 0) {
    const child = { text: '' }
    Transforms.insertNodes(editor, child, {
      at: path.concat(0),
      voids: true,
    })
    return
  }

  // Determine whether the node should have block or inline children.
  const shouldHaveInlines =
    node === editor
      ? false
      : Node.isElement(node) &&
        (editor.isInline(node) ||
          node.children.length === 0 ||
          Node.isText(node.children[0]) ||
          editor.isInline(node.children[0]))

  // Since we'll be applying operations while iterating, keep track of an
  // index that accounts for any added/removed nodes.
  let n = 0

  for (let i = 0; i < node.children.length; i++, n++) {
    const currentNode = Node.get(editor, path)
    if (Node.isText(currentNode)) continue
    const child = currentNode.children[n] as Descendant
    const prev = currentNode.children[n - 1] as Descendant
    const isLast = i === node.children.length - 1
    const isInlineOrText =
      Node.isText(child) || (Node.isElement(child) && editor.isInline(child))

    // Only allow block nodes in the top-level children and parent blocks
    // that only contain block nodes. Similarly, only allow inline nodes in
    // other inline nodes, or parent blocks that only contain inlines and
    // text.
    if (isInlineOrText !== shouldHaveInlines) {
      if (isInlineOrText) {
        if (options?.fallbackElement) {
          Transforms.wrapNodes(editor, options.fallbackElement(), {
            at: path.concat(n),
            voids: true,
          })
        } else {
          Transforms.removeNodes(editor, { at: path.concat(n), voids: true })
        }
      } else {
        Transforms.unwrapNodes(editor, { at: path.concat(n), voids: true })
      }
      n--
    } else if (Node.isElement(child)) {
      // Ensure that inline nodes are surrounded by text nodes.
      if (editor.isInline(child)) {
        if (prev == null || !Node.isText(prev)) {
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
      // If the child is not a text node, and doesn't have a `children` field,
      // then we have an invalid node that will upset slate.
      //
      // eg: `{ type: 'some_node' }`.
      //
      // To prevent slate from breaking, we can add the `children` field,
      // and now that it is valid, we can to many more operations easily,
      // such as extend normalizers to fix erronous structure.
      if (!Node.isText(child) && !('children' in child)) {
        const elementChild = child as Element
        elementChild.children = []
      }

      // Merge adjacent text nodes that are empty or match.
      if (prev != null && Node.isText(prev)) {
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
}
