/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.delete()
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph>
          one<anchor />
        </paragraph>
      </quote>
      <paragraph>
        <focus />two
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <paragraph>
          one<cursor />two
        </paragraph>
      </quote>
    </document>
  </state>
)
