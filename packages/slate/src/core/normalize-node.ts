import { Editor } from '../interfaces/editor'
import { Element } from '../interfaces/element'
import { Descendant, Node } from '../interfaces/node'
import { SlateErrors } from '../interfaces/slate-errors'
import { Text } from '../interfaces/text'
import { Transforms } from '../interfaces/transforms'
import { WithEditorFirstArg } from '../utils/types'

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
    if (!currentNode) {
      const err = editor.onError({
        key: 'normalizeNode.get',
        message: `Cannot get the node at path [${path}] while normalizing.`,
        data: { path },
        error: SlateErrors.NodeGet(editor, path),
      })
      if (err) {
        return
      }

      continue
    }

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
