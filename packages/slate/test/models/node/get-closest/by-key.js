/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <paragraph>
        <anchor />two<focus />
      </paragraph>
      <paragraph>three</paragraph>
      <paragraph>four</paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getClosestBlock(selection.end.key)
}

export const output = (
  <paragraph>
    <anchor />two<focus />
  </paragraph>
)
