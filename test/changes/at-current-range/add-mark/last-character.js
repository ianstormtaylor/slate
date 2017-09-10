/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.addMark('bold')
}

export const input = (
  <state>
    <document>
      <paragraph>
        wor<anchor />d<focus />
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        wor<anchor /><b>d</b><focus />
      </paragraph>
    </document>
  </state>
)
