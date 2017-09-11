/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.deleteForward()
}

export const input = (
  <state>
    <document>
      <paragraph>
        word<cursor />
      </paragraph>
      <paragraph>
        <emoji />
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        word<cursor /><emoji />
      </paragraph>
    </document>
  </state>
)
