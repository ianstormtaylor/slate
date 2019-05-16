/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.addMarks([
    {
      type: 'bold',
      data: { thing: 'value' },
    },

    {
      type: 'italic',
      data: { thing2: 'value2' },
    },
  ])
}

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />w<focus />ord
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <i thing2="value2">
          <b thing="value">
            <anchor />w
          </b>
        </i>
        <focus />ord
      </paragraph>
    </document>
  </value>
)
