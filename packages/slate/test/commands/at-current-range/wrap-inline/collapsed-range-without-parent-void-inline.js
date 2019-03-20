/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.wrapInline('hashtag')
}

export const input = (
  <value>
    <document>
      <paragraph>
        w<cursor />d
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        w<cursor />d
      </paragraph>
    </document>
  </value>
)
