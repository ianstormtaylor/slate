/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.addMarks(['bold', 'italic']).insertText('a')
}

export const input = (
  <value>
    <document>
      <paragraph>
        word<cursor />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        word
        <i>
          <b>
            a<cursor />
          </b>
        </i>
      </paragraph>
    </document>
  </value>
)
