/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { state } = change
  const { startText } = state
  change.select({
    anchorKey: startText.key,
    anchorOffset: 0,
    focusKey: startText.key,
    focusOffset: startText.text.length,
  })
}

export const input = (
  <state>
    <document>
      <paragraph>
        <cursor />one
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <anchor />one<focus />
      </paragraph>
    </document>
  </state>
)
