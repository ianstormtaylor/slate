/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.unwrapNodeByKey('a')
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph>
          one
        </paragraph>
        <paragraph key="a">
          two
        </paragraph>
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <paragraph>
          one
        </paragraph>
      </quote>
      <paragraph>
        two
      </paragraph>
    </document>
  </state>
)
