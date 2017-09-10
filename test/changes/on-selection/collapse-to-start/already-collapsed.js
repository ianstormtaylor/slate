/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.collapseToStart()
}

export const input = (
  <state>
    <document>
      <paragraph>
        on<cursor />e
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        on<cursor />e
      </paragraph>
    </document>
  </state>
)
