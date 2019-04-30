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

// TODO: the selection logic here is wrong
export const output = (
  <value>
    <document>
      <paragraph>
        <text />
        <link>
          <text />
          <hashtag>hel</hashtag>
          <anchor />
          <focus />lo
        </link>
        <text />
      </paragraph>
    </document>
  </value>
)
