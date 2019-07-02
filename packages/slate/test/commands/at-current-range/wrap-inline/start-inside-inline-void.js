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
          <emoji>
            <anchor />
          </emoji>
          word
        <focus />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link>
          <emoji>
            <anchor />
          </emoji>
          word
        </link>
        <focus />
      </paragraph>
    </document>
  </value>
)
