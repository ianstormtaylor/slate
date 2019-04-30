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

// TODO: this selection logic isn't right
export const output = (
  <value>
    <document>
      <paragraph>
        <text />
        <link>
          hel<hashtag>lo</hashtag>
          <text>
            <cursor />
          </text>
        </link>
        <text />
      </paragraph>
    </document>
  </value>
)
