/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>1</paragraph>
      <paragraph>
        <paragraph>2</paragraph>
        <paragraph>
          <paragraph>2.1</paragraph>
        </paragraph>
      </paragraph>
      <paragraph>
        <paragraph>
          <paragraph>3.1</paragraph>
        </paragraph>
        <paragraph>3.2</paragraph>
      </paragraph>
      <paragraph>
        <anchor />4><focus />
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getPreviousBlock(selection.end.path)
}

export const output = <paragraph>3.2</paragraph>
