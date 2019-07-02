/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.wrapInline({
    type: 'link',
  })
}

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />
        word
        <emoji>
          <focus />
        </emoji>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link>
          <anchor />
          word
        </link>
        <emoji>
          <focus />
        </emoji>
      </paragraph>
    </document>
  </value>
)
