/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const node = change.state.document.getBlocks().first()
  change.insertNodeByKey('a', 0, node)
}

export const input = (
  <state>
    <document key="a">
      <paragraph>
        one
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document key="a">
      <paragraph>
        one
      </paragraph>
      <paragraph>
        one
      </paragraph>
    </document>
  </state>
)
