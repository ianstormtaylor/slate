/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.removeTextByPath([0, 1, 1, 0], 0, 1)
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text />
        <link>
          <text />
          <hashtag>
            <text key="a">
              <cursor />a
            </text>
          </hashtag>
          <text />
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
        <link>
          <text />
          <hashtag>
            <cursor />
          </hashtag>
          <text />
        </link>
        <text />
      </paragraph>
    </document>
  </value>
)
