import { WithEditorFirstArg } from '../utils/types'
import { Text } from '../interfaces/text'
import { Element } from '../interfaces/element'
import { Transforms } from '../interfaces/transforms'
import { Descendant, Node } from '../interfaces/node'
import { Editor } from '../interfaces/editor'

export const normalizeNode: WithEditorFirstArg<Editor['normalizeNode']> = (
  editor,
  entry
) => {
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
    const child = currentNode.children[n] as Descendant
    const prev = currentNode.children[n - 1] as Descendant
    const isLast = i === node.children.length - 1
    const isInlineOrText =
      Text.isText(child) || (Element.isElement(child) && editor.isInline(child))

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
      // If the child is not a text node, and doesn't have a `children` field,
      // then we have an invalid node that will upset slate.
      //
      // eg: `{ type: 'some_node' }`.
      //
      // To prevent slate from breaking, we can add the `children` field,
      // and now that it is valid, we can to many more operations easily,
      // such as extend normalizers to fix erronous structure.
      if (!Text.isText(child) && !('children' in child)) {
        const elementChild = child as Element
        elementChild.children = []
      }

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
}
