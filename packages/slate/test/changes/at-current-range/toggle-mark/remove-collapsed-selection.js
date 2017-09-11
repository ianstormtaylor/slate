/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change
    .toggleMark('bold')
    .toggleMark('bold')
    .insertText('s')
}

export const input = (
  <state>
    <document>
      <paragraph>
        word<cursor />
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        words<cursor />
      </paragraph>
    </document>
  </state>
)
