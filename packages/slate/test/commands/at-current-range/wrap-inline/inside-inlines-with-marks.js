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
          <b>
            h<anchor />
            ell
          </b>
          <focus />o
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
          <b>h</b>
          <hashtag>
            <b>ell</b>
          </hashtag>
          <cursor />o
        </link>
        <text />
      </paragraph>
    </document>
  </value>
)
