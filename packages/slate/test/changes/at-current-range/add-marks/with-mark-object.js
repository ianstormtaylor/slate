/** @jsx h */

import h from '../../../helpers/h'

import { Mark } from 'slate'

export default function(change) {
  const marks = []

  marks.push(
    Mark.create({
      type: 'bold',
      data: { thing: 'value' },
    })
  )

  marks.push(
    Mark.create({
      type: 'italic',
      data: { thing2: 'value2' },
    })
  )

  change.addMarks(marks)
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
