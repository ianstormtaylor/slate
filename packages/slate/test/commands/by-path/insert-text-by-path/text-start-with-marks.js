/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertTextByPath([0, 0], 0, 'a')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <b>
          wo<cursor />rd
        </b>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        a<b>
          wo<cursor />rd
        </b>
      </paragraph>
    </document>
  </value>
)
