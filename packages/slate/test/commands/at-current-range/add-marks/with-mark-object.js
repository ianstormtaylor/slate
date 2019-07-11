/** @jsx h */

import h from '../../../helpers/h'

import { Mark } from 'slate'

export default function(editor) {
  editor.addMarks([
    Mark.create({
      type: 'bold',
      data: { thing: 'value' },
    }),
    Mark.create({
      type: 'italic',
      data: { thing2: 'value2' },
    }),
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
