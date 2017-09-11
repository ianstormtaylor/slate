/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.unwrapNodeByKey('a')
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph key="a">
          word
        </paragraph>
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        word
      </paragraph>
    </document>
  </state>
)
