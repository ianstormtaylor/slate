/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.wrapInline('link')
  editor.wrapInline('hashtag')
}

export const input = (
  <value>
    <document>
      <paragraph>
        w<anchor />or<focus />d
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        w
        <hashtag>
          <text />
          <link>
            <anchor />or
          </link>
          <text />
        </hashtag>
        <focus />d
      </paragraph>
    </document>
  </value>
)
