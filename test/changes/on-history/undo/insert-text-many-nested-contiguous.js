/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const second = texts.get(1)

  change
    .collapseToStartOf(second)
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
      <paragraph>paragraph one</paragraph>
      <paragraph>
        <list>list one</list>
        <list>list two</list>
      </paragraph>
      <paragraph>paragraph three</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>paragraph one</paragraph>
      <paragraph>
        <list>list one</list>
        <list>list two</list>
      </paragraph>
      <paragraph>paragraph three</paragraph>
    </document>
  </state>
)
