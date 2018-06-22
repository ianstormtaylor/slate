/** @jsx h */
/* eslint-disable import/no-extraneous-dependencies */
import { Mark } from 'slate'
import h from '../../../helpers/h'

export default function(change) {
  change.addMark(
    Mark.create({
      type: 'bold',
      data: { thing: 'value' },
    })
  )
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
        <b thing="value">w</b>
        <focus />ord
      </paragraph>
    </document>
  </value>
)
