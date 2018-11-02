/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.delete()
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
        <link>
          an<focus />other
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
        <link>wo</link>
        <text />
        <link>
          <cursor />other
        </link>
        <text />
      </paragraph>
    </document>
  </value>
)
