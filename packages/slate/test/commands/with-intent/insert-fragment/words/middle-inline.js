/** @jsx h */

import h from '../../../../helpers/h'

export default function(editor) {
  editor.insertFragment(
    <document>
      <paragraph>fragment</paragraph>
    </document>
  )
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          wo<cursor />rd
        </link>
      </paragraph>
    </document>
  </value>
)

// TODO: argument to made that fragment should go into the inline
export const output = (
  <value>
    <document>
      <paragraph>
        <link>wo</link>
        fragment<cursor />
        <link>rd</link>
      </paragraph>
    </document>
  </value>
)
