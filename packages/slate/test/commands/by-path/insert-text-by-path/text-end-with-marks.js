/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertTextByPath([0, 0], 4, 'x')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <b>
          w<cursor />ord
        </b>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <b>
          w<cursor />ord
        </b>x
      </paragraph>
    </document>
  </value>
)
