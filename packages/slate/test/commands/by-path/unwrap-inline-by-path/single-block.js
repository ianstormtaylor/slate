/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.unwrapInlineByPath([0, 1], 'link')
}

export const input = (
  <value>
    <document>
      <paragraph>
        w<link key="a">or</link>d<link>another</link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        word<link>another</link>
      </paragraph>
    </document>
  </value>
)
