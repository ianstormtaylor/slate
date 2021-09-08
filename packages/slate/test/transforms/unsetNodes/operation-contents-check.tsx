/** @jsx jsx */
import assert from 'assert'
import { Transforms, Text, Editor } from 'slate'
import { jsx } from '../..'

export const run = (editor: Editor) => {
  Transforms.unsetNodes(editor, 'someKey', { at: [0] })

  // unsetNodes uses null to remove properties, but that should not
  // flow through to the operation
  const [setNode] = editor.operations

  if (setNode.type === 'set_node') {
    assert.deepStrictEqual(setNode, {
      type: 'set_node',
      path: [0],
      properties: { someKey: true },
      newProperties: {},
    })
  } else {
    // eslint-disable-next-line no-console
    console.error('operations:', editor.operations)
    assert.fail('operation was not a set node')
  }
}
export const input = (
  <editor>
    <block someKey>word</block>
  </editor>
)
export const output = (
  <editor>
    <block>word</block>
  </editor>
)
