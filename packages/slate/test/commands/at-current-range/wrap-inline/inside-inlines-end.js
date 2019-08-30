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
          hel
          <anchor />
          lo
        </link>
        <focus />
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
        <hashtag>
          <link>
            <anchor />
            lo
          </link>
        </hashtag>
        <focus />
      </paragraph>
    </document>
  </value>
)
