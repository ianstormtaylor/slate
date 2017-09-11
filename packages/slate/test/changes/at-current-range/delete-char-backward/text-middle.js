/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.deleteCharBackward()
}

export const input = (
  <state>
    <document>
      <paragraph>
        wor<cursor />d
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        wo<cursor />d
      </paragraph>
    </document>
  </state>
)
