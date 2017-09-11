/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.setInline({ type: 'hashtag' })
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link><anchor />word</link>
      </paragraph>
      <paragraph>
        <link><focus />another</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <hashtag><anchor />word</hashtag>
      </paragraph>
      <paragraph>
        <hashtag><focus />another</hashtag>
      </paragraph>
    </document>
  </state>
)
