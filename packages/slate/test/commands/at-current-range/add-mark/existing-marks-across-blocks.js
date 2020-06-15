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
          wo<anchor />rd
        </i>
      </paragraph>
      <paragraph>
        <i>
          an<focus />other
        </i>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <i>wo</i>
        <b>
          <i>
            <anchor />rd
          </i>
        </b>
      </paragraph>
      <paragraph>
        <b>
          <i>an</i>
        </b>
        <i>
          <focus />other
        </i>
      </paragraph>
    </document>
  </value>
)
