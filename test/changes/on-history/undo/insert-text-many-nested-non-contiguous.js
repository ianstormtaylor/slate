/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const first = texts.get(0)
  const second = texts.get(1)
  const third = texts.get(2)
  const fourth = texts.get(3)

  change
    .collapseToStartOf(first)
    .insertText('text')

    .change()
    .collapseToStartOf(second)
    .insertText('text')
    .state

    .change()
    .collapseToStartOf(third)
    .insertText('text')
    .state

    .change()
    .collapseToStartOf(fourth)
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
      <paragraph>textparagraph one</paragraph>
      <paragraph>
        <list>textlist one</list>
        <list>textlist two</list>
      </paragraph>
      <paragraph>paragraph three</paragraph>
    </document>
  </state>
)
