/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  // simply calling removeMark on text that does not have that mark should not
  // create an undo history to later add the mark.
  editor
    .moveToRangeOfDocument()
    .removeMark('bold')
    .undo()
}

export const input = (
  <value>
    <document>
      <paragraph>Text</paragraph>
    </document>
  </value>
)

export const output = input
