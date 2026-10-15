/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = (editor: Editor) => {
  editor.setNodes(node => ({ type: 'paragraph', key: Editor.isEditor(node) }), {
    at: [0],
    replace: true,
  })
}
export const input = (
  <editor>
    <block type="callout" data="blue">
      word
    </block>
  </editor>
)
export const output = (
  <editor>
    <block type="paragraph" key={false}>
      word
    </block>
  </editor>
)
