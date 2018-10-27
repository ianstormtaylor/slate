/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.setBlocks({ type: 'code' })
}

export const input = (
  <value>
    <document>
      <paragraph>
        <paragraph>
          <cursor />word
        </paragraph>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <code>
          <cursor />word
        </code>
      </paragraph>
    </document>
  </value>
)
