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
          hel<anchor />lo<focus />
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
        <link>hel</link>
        <text />
        <hashtag>
          <text />
          <link>
            <anchor />lo<focus />
          </link>
          <text />
        </hashtag>
        <text />
      </paragraph>
    </document>
  </value>
)
