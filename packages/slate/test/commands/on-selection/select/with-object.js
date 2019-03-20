/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  const { value } = editor
  const { startText } = value

  editor.select({
    anchor: {
      key: startText.key,
      offset: 0,
    },
    focus: {
      key: startText.key,
      offset: startText.text.length,
    },
  })
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />one
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <anchor />one<focus />
      </paragraph>
    </document>
  </value>
)
