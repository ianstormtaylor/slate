/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change
    .toggleMark('bold')
    .insertText('a')
}

export const input = (
  <state>
    <document>
      <paragraph>
        <cursor />word
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <b>a</b><cursor />word
      </paragraph>
    </document>
  </state>
)
