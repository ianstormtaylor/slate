/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.addMark('bold')
}

export const input = (
  <value>
    <document>
      <paragraph>
        wo<i>
          <anchor />rd
        </i>
      </paragraph>
      <paragraph>
        <i>an</i>
        <focus />other
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        wo
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
        <focus />other
      </paragraph>
    </document>
  </value>
)
