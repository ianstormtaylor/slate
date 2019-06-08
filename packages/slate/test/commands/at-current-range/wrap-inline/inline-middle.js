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
          he<anchor />ll<focus />o
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
        <link>he</link>
        <text />
        <hashtag>
          <link>
            <anchor />ll
          </link>
        </hashtag>
        <text />
        <link>
          <focus />o
        </link>
        <text />
      </paragraph>
    </document>
  </value>
)
