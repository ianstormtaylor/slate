/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.wrapBlock('quote')
}

export const input = (
  <value>
    <document>
      <paragraph>
        wo<anchor />rd
      </paragraph>
      <paragraph>
        an<focus />other
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>
          wo<anchor />rd
        </paragraph>
        <paragraph>
          an<focus />other
        </paragraph>
      </quote>
    </document>
  </value>
)
