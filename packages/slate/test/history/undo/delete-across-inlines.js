/** @jsx h */

import h from '../../helpers/h'

export default function (editor) {
  editor.delete()
  editor.flush()
  editor.undo()
}

export const input = (
  <value>
    <document>
      <block>
        <text />
        <link data={{ url: 'https://www.google.com' }}>
          o<anchor />ne
        </inline>
        <text />
      </block>
      <block>
        <text />
        <link data={{ url: 'https://www.github.com' }}>
          tw<focus />o
        </inline>
        <text />
      </block>
    </document>
  </value>
)

export const output = input
