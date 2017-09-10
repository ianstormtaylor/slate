/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const inline = document.assertPath([0, 1])

  change
    .unwrapInlineByKey(inline.key, 'hashtag')
}

export const input = (
  <state>
    <document>
      <paragraph>w
        <hashtag>or</hashtag>d
        <hashtag>another</hashtag>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>word
        <hashtag>another</hashtag>
      </paragraph>
    </document>
  </state>
)
