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
            he<anchor />ll<focus />o
          </b>
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
          <b>he</b>
        </link>
        <text />
        <hashtag>
          <link>
            <b>
              <anchor />ll
            </b>
          </link>
        </hashtag>
        <text />
        <link>
          <b>
            <focus />o
          </b>
        </link>
        <text />
      </paragraph>
    </document>
  </value>
)
