/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.splitInline(1)
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text />
        <link>
          <text />
          <link>
            wo<cursor />rd
          </link>
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
          <link>wo</link>
          <text />
          <link>
            <cursor />rd
          </link>
          <text />
        </link>
        <text />
      </paragraph>
    </document>
  </value>
)
