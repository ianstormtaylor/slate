/** @jsx h */

import h from '../../../helpers/h'

function insertBlockByType(editor, blockType) {
  editor.insertBlock({ type: blockType })
}

export default function(editor) {
  editor.command(insertBlockByType, 'image')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />one
      </paragraph>
      <paragraph>two</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <image>
        <cursor />
      </image>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
    </document>
  </value>
)
