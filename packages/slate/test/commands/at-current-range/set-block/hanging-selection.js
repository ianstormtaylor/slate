/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.setBlocks({ type: 'code' })
}

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />word
      </paragraph>
      <paragraph>
        <focus />another
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <code>
        <anchor />word
      </code>
      <paragraph>
        <focus />another
      </paragraph>
    </document>
  </value>
)
