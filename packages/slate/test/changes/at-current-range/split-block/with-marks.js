/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change
    .addMark('italic')
    .splitBlock()
    .insertText('cat is cute')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <b>word</b>
        <cursor />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <b>word</b>
        <cursor />
      </paragraph>
      <paragraph>
        <i>
          <b>cat is cute</b>
        </i>
        <cursor />
      </paragraph>
    </document>
  </value>
)
