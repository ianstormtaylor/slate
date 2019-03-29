/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <paragraph>
        <inline type="inline_type" />
        <inline type="inline_type" />
        <anchor />two<focus />
      </paragraph>
      <paragraph>three</paragraph>
      <paragraph>four</paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getPreviousBlock(selection.end.path)
}

export const output = <paragraph>one</paragraph>
