/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.setMarkByKey(
    'a',
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
        <b key="a" thing="value">
          word
        </b>
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
