/** @jsx jsx */
import { jsx } from '../..'
import { Editor, Element, Transforms } from 'slate'

export const input = (
  <editor>
    <element type="body" />
  </editor>
)

// patch in a custom normalizer that inserts empty paragraphs in the body instead of text nodes
// this test also verifies the new node itself is also normalized, because it's inserting a non-normalized node
const editor = input as unknown as Editor
const defaultNormalize = editor.normalizeNode
editor.normalizeNode = entry => {
  const [node, path] = entry
  if (
    Element.isElement(node) &&
    node.children.length === 0 &&
    (node as any).type === 'body'
  ) {
    const child = { type: 'paragraph', children: [] }
    Transforms.insertNodes(editor, child, {
      at: path.concat(0),
      voids: true,
    })
  } else {
    defaultNormalize(entry)
  }
}

export const output = (
  <editor>
    <element type="body">
      <element type="paragraph">
        <text />
      </element>
    </element>
  </editor>
)
