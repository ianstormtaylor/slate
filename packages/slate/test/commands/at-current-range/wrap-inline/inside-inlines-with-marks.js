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
            h<anchor />ell
          </b>
          <focus />o
        </link>
        <text />
      </paragraph>
    </document>
  </value>
)

// TODO: this selection logic isn't right
export const output = (
  <value>
    <document>
      <paragraph>
        <text />
        <link>
          <b>h</b>
          <hashtag>
            <b>
              ell<anchor />
            </b>
          </hashtag>
          <focus />o
        </link>
        <text />
      </paragraph>
    </document>
  </value>
)
