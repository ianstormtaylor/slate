/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.unwrapInline('hashtag')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>wo</link>
        <hashtag>
          <link>
            <anchor />
            rd
          </link>
        </hashtag>
        <hashtag>
          <link>an</link>
        </hashtag>
        <link>
          ot
          <focus />
          her
        </link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link>wo</link>
        <link>
          <anchor />
          rd
        </link>
        <link>an</link>
        <link>
          ot
          <focus />
          her
        </link>
      </paragraph>
    </document>
  </value>
)
