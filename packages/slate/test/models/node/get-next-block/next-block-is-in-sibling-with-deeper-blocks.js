/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>1</paragraph>
      <paragraph>
        <anchor />2<focus />
      </paragraph>
      <paragraph>
        <paragraph>3</paragraph>
        <paragraph>
          <paragraph>3.1</paragraph>
        </paragraph>
      </paragraph>
      <paragraph>4</paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getNextBlock(selection.end.path)
}

export const output = <paragraph>3</paragraph>
