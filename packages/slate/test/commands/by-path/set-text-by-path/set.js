/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.setTextByPath([0, 0], 'two')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />one
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        two<cursor />
      </paragraph>
    </document>
  </value>
)
