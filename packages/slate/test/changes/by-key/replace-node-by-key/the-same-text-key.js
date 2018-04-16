/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  const { startText } = change.value
  change.replaceNodeByKey(startText.key, startText)
}

export const input = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <paragraph key="a">
        t<cursor />wo
      </paragraph>
    </document>
  </value>
)

export const output = input
