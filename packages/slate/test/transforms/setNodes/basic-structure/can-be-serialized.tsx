/** @jsx jsx */
import assert from 'assert'
import { Editor, Transforms, Operation } from 'slate'
import { jsx } from '../../..'

export const run = (editor: Editor) => {
  Transforms.setNodes(editor, { someKey: true }, { at: [0] })
  const [op] = editor.operations
  const roundTrip: Operation = JSON.parse(JSON.stringify(op))
  assert.deepStrictEqual(op, roundTrip)
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
    <block someKey>
      <text />
    </block>
  </editor>
)
