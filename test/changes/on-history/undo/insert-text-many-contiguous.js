/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.get(0)

  change
    .collapseToStartOf(first)
    .insertText('text')

    .change()
    .insertText('text')
    .state

    .change()
    .undo()
    .state
}

export const input = (
  <state>
    <document>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
    </document>
  </state>
)
