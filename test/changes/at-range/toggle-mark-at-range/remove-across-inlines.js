/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const second = texts.get(1)
  const fifth = texts.get(4)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 2,
    focusKey: fifth.key,
    focusOffset: 2
  })

  return state
    .change()
    .toggleMarkAtRange(range, 'bold')
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link>
          <b>word</b>
        </link>
      </paragraph>
      <paragraph>
        <link>
          <b>another</b>
        </link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link>
          <b>wo</b>rd
        </link>
      </paragraph>
      <paragraph>
        <link>an
          <b>other</b>
        </link>
      </paragraph>
    </document>
  </state>
)
