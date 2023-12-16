/** @jsx jsx */
import { Editor, Element, Transforms } from 'slate'
import { jsx } from '../..'
import _ from 'lodash'

export const input = (
  <editor>
    <block type="body" attr={{ a: true }}>
      one
    </block>
  </editor>
)

const editor = input as unknown as Editor
const defaultNormalize = editor.normalizeNode
editor.normalizeNode = entry => {
  const [node, path] = entry
  if (
    Element.isElement(node) &&
    (node as any).type === 'body' &&
    Editor.string(editor, path, { voids: true }) === 'one'
  ) {
    Transforms.setNodes(
      editor,
      { attr: { a: false } },
      { at: path, compare: (p, n) => !_.isEqual(p, n) }
    )
  }

  defaultNormalize(entry)
}

export const run = editor => {
  Editor.normalize(editor, { force: true })
}

export const output = (
  <editor>
    <block type="body" attr={{ a: false }}>
      one
    </block>
  </editor>
)
