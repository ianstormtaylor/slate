/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.setMarkByPath(
    [0, 0],
    0,
    2,
    {
      type: 'bold',
      data: { thing: 'value' },
    },
    {
      data: { thing: false },
    }
  )
}

export const input = (
  <value>
    <document>
      <paragraph>
        <b thing="value">word</b>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <b thing={false}>wo</b>
        <b thing="value">rd</b>
      </paragraph>
    </document>
  </value>
)
