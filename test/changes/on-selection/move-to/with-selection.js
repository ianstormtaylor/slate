/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { state } = change
  const { selection, startText } = state
  const range = selection.merge({
    anchorKey: startText.key,
    anchorOffset: 0,
    focusKey: startText.key,
    focusOffset: startText.text.length,
  })

  change.select(range)
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
