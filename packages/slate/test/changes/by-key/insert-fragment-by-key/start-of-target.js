/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.insertFragmentByKey('a', 0, (
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
        one
      </paragraph>
      <paragraph>
        two
      </paragraph>
      <paragraph>
        word
      </paragraph>
    </document>
  </state>
)
