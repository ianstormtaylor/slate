/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.delete()
}

export const input = (
  <state>
    <document>
      <paragraph>
        w<anchor />o<focus />rd
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        w<cursor />rd
      </paragraph>
    </document>
  </state>
)
