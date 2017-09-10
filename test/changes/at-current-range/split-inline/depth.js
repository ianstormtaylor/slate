/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const second = texts.get(2)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 2,
    focusKey: second.key,
    focusOffset: 2
  })

  change
    .select(range)
    .splitInline(1)

  const updated = next.document.getTexts().get(4)

  assert.deepEqual(
    next.selection.toJS(),
    range.collapseToStartOf(updated).toJS()
  )
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link>
          <link>word</link>
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
          <link>wo</link>
          <link>rd</link>
        </link>
      </paragraph>
    </document>
  </state>
)
