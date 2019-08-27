/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.splitBlock()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text />
        <link>
          wo<anchor />rd
        </link>
        <text />
      </paragraph>
      <paragraph>
        <text />
        <hashtag>
          an<focus />other
        </hashtag>
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
        <link>wo</link>
        <text />
        <hashtag>
          <text />
        </hashtag>
        <text />
      </paragraph>
      <paragraph>
        <text />
        <hashtag>
          <cursor />other
        </hashtag>
        <text />
      </paragraph>
    </document>
  </value>
)
