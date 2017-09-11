/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.wrapBlockByKey('a', 'quote')
}

export const input = (
  <state>
    <document>
      <paragraph>
        <text key="a">word</text>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <quote>
          word
        </quote>
      </paragraph>
    </document>
  </state>
)
