/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertFragment(
    <document>
      <paragraph>
        <b>b</b>
        <u>u</u>
        <i>i</i>
      </paragraph>
    </document>
  )
}

export const input = (
  <value>
    <document>
      <paragraph>
        wo<cursor />rd
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        wo
        <b>b</b>
        <u>u</u>
        <i>
          i<cursor />
        </i>
        rd
      </paragraph>
    </document>
  </value>
)
