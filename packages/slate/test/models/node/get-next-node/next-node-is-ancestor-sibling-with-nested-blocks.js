/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <paragraph>
        <anchor />two<focus />
      </paragraph>
      <paragraph>
        <paragraph>three</paragraph>
      </paragraph>
      <paragraph>four</paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getNextNode(selection.end.path)
}

export const output = (
  <paragraph>
    <paragraph>three</paragraph>
  </paragraph>
)
