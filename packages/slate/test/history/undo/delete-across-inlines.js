/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.delete()
  editor.flush().undo()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text />
        <link data={{ url: 'https://www.google.com' }}>
          o<anchor />ne
        </link>
        <text />
      </paragraph>
      <paragraph>
        <text />
        <link data={{ url: 'https://www.github.com' }}>
          tw<focus />o
        </link>
        <text />
      </paragraph>
    </document>
  </value>
)

export const output = input
