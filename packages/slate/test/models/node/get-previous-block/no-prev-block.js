/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>
        <inline type="inline_type">zer</inline>
        <anchor />one<focus />
      </paragraph>
      <paragraph>two</paragraph>
      <paragraph>three</paragraph>
      <paragraph>
        <paragraph>four</paragraph>
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getPreviousBlock(selection.end.path)
}

export const output = null
