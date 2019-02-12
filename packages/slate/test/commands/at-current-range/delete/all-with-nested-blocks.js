/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.delete()
}

export const input = (
  <value>
    <document>
      <block type="container">
        <paragraph key="original paragraph">
          <anchor />one
        </paragraph>
        <block type="container">
          <paragraph> two</paragraph>
          <paragraph> three</paragraph>
          <block type="container">
            <paragraph> four</paragraph>
            <block type="container">
              <paragraph> five<focus /></paragraph>
            </block>
          </block>
        </block>
      </block>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <block type="container">
        <paragraph key="original paragraph"><cursor /></paragraph>
      </block>
    </document>
  </value>
)
