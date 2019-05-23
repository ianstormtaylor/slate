/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.toggleMark('bold').insertText('s')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <b>
          <i>
            wo<cursor />rd
          </i>
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
          <i>
            wo
          </i>
        </b>
        <i>
          s<cursor />
        </i>
        <b>
          <i>
            rd
          </i>
        </b>
      </paragraph>
    </document>
  </value>
)
