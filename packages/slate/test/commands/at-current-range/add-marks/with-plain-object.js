/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  const marks = []

  marks.push({
    type: 'bold',
    data: { thing: 'value' },
  })

  marks.push({
    type: 'italic',
    data: { thing2: 'value2' },
  })

  editor.addMarks(marks)
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
        <anchor />
        <i thing2="value2">
          <b thing="value">w</b>
        </i>
        <focus />ord
      </paragraph>
    </document>
  </value>
)
