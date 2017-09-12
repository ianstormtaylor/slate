/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.delete()
}

export const input = (
  <state>
    <document>
      <paragraph>
        on<anchor />e
      </paragraph>
      <image>
        {' '}<focus />
      </image>
      <paragraph>
        three
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        on<cursor />
      </paragraph>
      <paragraph>
        three
      </paragraph>
    </document>
  </state>
)
