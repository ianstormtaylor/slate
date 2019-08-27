/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.wrapInline('hashtag')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text />
        <link>
          <anchor />hel<focus />lo
        </link>
        <text />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <text />
        <hashtag>
          <text />
          <link>
            <anchor />hel
          </link>
          <text />
        </hashtag>
        <text />
        <link>
          <focus />lo
        </link>
        <text />
      </paragraph>
    </document>
  </value>
)
