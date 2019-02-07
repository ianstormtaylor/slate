/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <paragraph>
        <inline type="inline_type">
          <anchor />two<focus />
        </inline>
      </paragraph>
      <paragraph>three</paragraph>
      <paragraph>four</paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getClosestBlock(selection.end.path)
}

export const output = (
  <paragraph>
    <inline type="inline_type">
      <anchor />two<focus />
    </inline>
  </paragraph>
)
