import { Path, Range } from 'slate'
import { DOMNode, DOMText, getSelection, isDOMNode } from 'slate-dom'
import { ReactEditor } from '../plugin/react-editor'

const isTextNode = (node: DOMNode | null | undefined): node is DOMText =>
  isDOMNode(node) && node.nodeType === node.TEXT_NODE

export const removeCompositionFromOtherLeaf = (
  editor: ReactEditor,
  data: string
) => {
  const { selection } = editor
  if (!selection || !Range.isCollapsed(selection)) return

  const domSelection = getSelection(
    ReactEditor.findDocumentOrShadowRoot(editor)
  )
  const node = domSelection?.anchorNode
  if (!domSelection || !isTextNode(node)) return

  const end = domSelection.anchorOffset
  const start = end - data.length
  if (start < 0 || node.data.slice(start, end) !== data) return
  if (!ReactEditor.hasDOMNode(editor, node, { editable: true })) return

  const leafPath = ReactEditor.findPath(
    editor,
    ReactEditor.toSlateNode(editor, node)
  )
  if (Path.equals(leafPath, selection.anchor.path)) return

  node.deleteData(start, data.length)
}
