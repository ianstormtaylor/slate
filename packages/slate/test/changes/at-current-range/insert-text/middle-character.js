/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.insertText('a')
}

export const input = (
  <state>
    <document>
      <paragraph>
        w<cursor />ord
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        wa<cursor />ord
      </paragraph>
    </document>
  </state>
)
