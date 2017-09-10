/** @jsx h */

import h from '../../../helpers/h'
import { Mark } from '../../../..'

export default function (change) {
  const marks = Mark.createSet([{ type: 'bold' }])
  change.insertText('a', marks)
}

export const input = (
  <state>
    <document>
      <paragraph>
        word<cursor />
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        word<b>a</b><cursor />
      </paragraph>
    </document>
  </state>
)
