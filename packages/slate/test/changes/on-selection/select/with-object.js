/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  const { value } = change
  const { startText } = value

  change.select({
    anchor: {
      key: startText.key,
      offset: 0,
    },
    focus: {
      key: startText.key,
      offset: startText.text.length,
    },
  })
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
