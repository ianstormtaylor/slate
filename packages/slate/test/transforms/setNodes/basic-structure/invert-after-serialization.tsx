/** @jsx jsx */
import { Editor, Transforms, Operation } from 'slate'
import { jsx } from '../../..'

export const run = (editor: Editor) => {
  Transforms.setNodes(editor, { key: true }, { at: [0] })
  const [op] = editor.operations
  const roundTrip: Operation = JSON.parse(JSON.stringify(op))
  const inverted = Operation.inverse(roundTrip)
  editor.apply(inverted)
}
export const input = (
  <editor>
    <block>
      <text />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text />
    </block>
  </editor>
)
