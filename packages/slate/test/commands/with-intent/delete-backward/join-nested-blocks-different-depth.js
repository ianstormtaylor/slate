/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.deleteBackward()
}

export const input = (
  <value>
    <document>
      <paragraph>Hello</paragraph>
      <list>
        <item>
          <cursor />world!
        </item>
      </list>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        Hello<cursor />world!
      </paragraph>
    </document>
  </value>
)
