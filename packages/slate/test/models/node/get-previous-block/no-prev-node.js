/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />one<focus />
      </paragraph>
      <paragraph>two</paragraph>
      <paragraph>
        <paragraph>three</paragraph>
      </paragraph>
      <paragraph>four</paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getPreviousBlock(selection.end.path)
}

export const output = null
