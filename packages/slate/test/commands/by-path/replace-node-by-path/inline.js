/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.replaceNodeByPath([0, 1], {
    object: 'inline',
    type: 'emoji',
  })
}

export const input = (
  <value>
    <document>
      <paragraph>
        one
        <link key="a">two</link>
        three
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one
        <emoji />
        three
      </paragraph>
    </document>
  </value>
)
