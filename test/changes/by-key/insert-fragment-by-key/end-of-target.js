/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.insertFragmentByKey('a', 1, (
    <document>
      <paragraph>
        one
      </paragraph>
      <paragraph>
        two
      </paragraph>
    </document>
  ))
}

export const input = (
  <state>
    <document key="a">
      <paragraph>
        word
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        word
      </paragraph>
      <paragraph>
        one
      </paragraph>
      <paragraph>
        two
      </paragraph>
    </document>
  </state>
)
