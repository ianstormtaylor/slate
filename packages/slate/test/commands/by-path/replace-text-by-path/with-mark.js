/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.replaceTextByPath([0, 1], 0, 1, 'three', ['italic'])
}

export const input = (
  <value>
    <document>
      <paragraph>
        one
        <b>
          <cursor />two
        </b>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one
        <i>
          <b>three</b>
        </i>
        <b>
          <cursor />wo
        </b>
      </paragraph>
    </document>
  </value>
)
