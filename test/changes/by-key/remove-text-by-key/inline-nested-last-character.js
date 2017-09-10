/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.removeTextByKey('a', 0, 1)
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link><hashtag><text key="a">a</text></hashtag></link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph />
    </document>
  </state>
)
