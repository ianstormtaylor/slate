/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.wrapInline('hashtag')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          he<anchor />ll<focus />o
        </link>
      </paragraph>
    </document>
  </value>
)

// TODO: this selection logic isn't right
export const output = (
  <value>
    <document>
      <paragraph>
        <link>
          he<hashtag>ll</hashtag>
          <cursor />o
        </link>
      </paragraph>
    </document>
  </value>
)
