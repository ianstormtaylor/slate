/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
      <paragraph>
        <paragraph>three</paragraph>
      </paragraph>
      <paragraph>
        <anchor />four<focus />
        <inline type="inline_type">five</inline>
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getNextBlock(selection.end.path)
}

export const output = null
