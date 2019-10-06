/** @jsx h */

import h from '../../../../helpers/h'

export default function(editor) {
  editor.insertFragment(
    <document>
      <quote>fragment</quote>
    </document>
  )
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          {'word '}
          <cursor />
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
        <link>{'word '}</link>
        fragment<cursor />
        <link />
      </paragraph>
    </document>
  </value>
)
