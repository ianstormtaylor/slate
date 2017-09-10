/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.insertText(' a few words')
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
        word a few words<cursor />
      </paragraph>
    </document>
  </state>
)
