/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.addMark('bold')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <i>
          <anchor />wo<focus />rd
        </i>
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
            <anchor />wo
          </i>
        </b>
        <i>
          <focus />rd
        </i>
      </paragraph>
    </document>
  </value>
)
