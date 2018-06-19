/** @jsx h */
/* eslint-disable import/no-extraneous-dependencies */

import { Range } from 'slate'
import h from '../../../helpers/h'

export default function(change) {
  const { value } = change
  const { startText } = value
  const range = Range.create({
    anchorKey: startText.key,
    anchorOffset: 0,
    focusKey: startText.key,
    focusOffset: startText.text.length,
  })

  change.select(range)
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
        <anchor />one<focus />
      </paragraph>
    </document>
  </value>
)
